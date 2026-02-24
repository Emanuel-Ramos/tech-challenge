/**
 * AI Code Review Orchestrator
 *
 * This script coordinates the AI-powered code review process:
 * 1. Collects PR context (files, diff, metadata)
 * 2. Identifies affected packages and routes to specialist agents
 * 3. Consolidates feedback and posts to the PR
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Import agents
const { runOrchestrator } = require("./agents/orchestrator");
const { runPaymentsAgent } = require("./agents/payments");
const { runDesignSystemAgent } = require("./agents/design-system");
const { runBestPracticesAgent } = require("./agents/best-practices");

/**
 * @typedef {Object} ChangedFile
 * @property {string} filename
 * @property {'added' | 'modified' | 'deleted'} status
 * @property {string} patch
 * @property {string | null} package
 */

/**
 * @typedef {Object} PRContext
 * @property {number} number
 * @property {string} title
 * @property {string} body
 * @property {ChangedFile[]} files
 * @property {string} diff
 */

/**
 * @typedef {Object} Finding
 * @property {'error' | 'warning' | 'suggestion'} severity
 * @property {string} file
 * @property {number | null} line
 * @property {string} message
 */

/**
 * @typedef {Object} AgentResponse
 * @property {string} agent
 * @property {'approved' | 'changes_requested' | 'comment'} status
 * @property {Finding[]} findings
 * @property {string} summary
 */

async function main() {
  const prNumber = process.env.PR_NUMBER;
  const repo = process.env.GITHUB_REPOSITORY;
  const changedFilesRaw = process.env.CHANGED_FILES || "";

  if (!prNumber || !repo) {
    console.error("Missing required environment variables: PR_NUMBER, GITHUB_REPOSITORY");
    process.exit(1);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Missing ANTHROPIC_API_KEY secret. Please add it to your repository secrets.");
    process.exit(1);
  }

  console.log(`Starting AI Code Review for PR #${prNumber}`);

  // Collect PR context
  const context = await collectPRContext(prNumber, changedFilesRaw);
  console.log(`Found ${context.files.length} changed files`);

  // Identify which packages are affected
  const affectedPackages = identifyAffectedPackages(context.files);
  console.log(`Affected packages: ${affectedPackages.join(", ") || "none"}`);

  // Run orchestrator to determine which agents to invoke
  const agentsToRun = await runOrchestrator(context, affectedPackages);
  console.log(`Agents to run: ${agentsToRun.join(", ")}`);

  // Run specialist agents in parallel
  const agentResults = await runAgents(agentsToRun, context);

  // Format and post the review comment
  const comment = formatReviewComment(context, agentResults, affectedPackages);
  await postComment(prNumber, comment);

  // Check if any agent requested changes (has errors)
  const hasErrors = agentResults.some(
    (r) => r.status === "changes_requested" || r.findings?.some((f) => f.severity === "error")
  );

  if (hasErrors) {
    console.log("AI Code Review completed with errors - failing CI");
    process.exit(1);
  }

  console.log("AI Code Review completed successfully");
}

/**
 * Collect PR context including files and diff
 */
async function collectPRContext(prNumber, changedFilesRaw) {
  // Get PR metadata
  const prJson = execSync(`gh pr view ${prNumber} --json title,body`, {
    encoding: "utf-8",
  });
  const prData = JSON.parse(prJson);

  // Get the full diff
  const diff = execSync(`gh pr diff ${prNumber}`, {
    encoding: "utf-8",
    maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large diffs
  });

  // Parse changed files
  const changedFiles = changedFilesRaw
    .split("\n")
    .filter((f) => f.trim())
    .map((filename) => {
      const pkg = detectPackage(filename);
      const status = detectFileStatus(filename, diff);
      const patch = extractFilePatch(filename, diff);

      return {
        filename,
        status,
        patch,
        package: pkg,
      };
    });

  return {
    number: parseInt(prNumber),
    title: prData.title,
    body: prData.body || "",
    files: changedFiles,
    diff,
  };
}

/**
 * Detect which package a file belongs to
 */
function detectPackage(filename) {
  if (filename.startsWith("packages/payments-module/")) {
    return "payments-module";
  }
  if (filename.startsWith("packages/design-system/")) {
    return "design-system";
  }
  if (filename.startsWith("apps/shell/")) {
    return "shell";
  }
  if (filename.startsWith("packages/types/")) {
    return "types";
  }
  return null;
}

/**
 * Detect file status from diff
 */
function detectFileStatus(filename, diff) {
  if (diff.includes(`new file mode`) && diff.includes(filename)) {
    return "added";
  }
  if (diff.includes(`deleted file mode`) && diff.includes(filename)) {
    return "deleted";
  }
  return "modified";
}

/**
 * Extract the patch for a specific file from the full diff
 */
function extractFilePatch(filename, diff) {
  const lines = diff.split("\n");
  let inFile = false;
  let patch = [];

  for (const line of lines) {
    if (line.startsWith("diff --git") && line.includes(filename)) {
      inFile = true;
      patch = [line];
    } else if (inFile && line.startsWith("diff --git")) {
      break;
    } else if (inFile) {
      patch.push(line);
    }
  }

  return patch.join("\n");
}

/**
 * Identify unique packages affected by the changes
 */
function identifyAffectedPackages(files) {
  const packages = new Set();
  for (const file of files) {
    if (file.package) {
      packages.add(file.package);
    }
  }
  return Array.from(packages);
}

/**
 * Run the specified agents and collect their responses
 */
async function runAgents(agentsToRun, context) {
  const results = [];

  // Always run best practices
  const agentPromises = [];

  if (agentsToRun.includes("payments")) {
    agentPromises.push(runPaymentsAgent(context).then((r) => results.push(r)));
  }

  if (agentsToRun.includes("design-system")) {
    agentPromises.push(runDesignSystemAgent(context).then((r) => results.push(r)));
  }

  if (agentsToRun.includes("best-practices")) {
    agentPromises.push(runBestPracticesAgent(context).then((r) => results.push(r)));
  }

  await Promise.all(agentPromises);

  return results;
}

/**
 * Format the review comment in markdown
 */
function formatReviewComment(context, agentResults, affectedPackages) {
  const lines = [];

  lines.push("## :robot: AI Code Review");
  lines.push("");
  lines.push("### Resumo");

  if (affectedPackages.length > 0) {
    lines.push(
      `Este PR modifica **${affectedPackages.length} package(s)**: ${affectedPackages.map((p) => `\`${p}\``).join(", ")}.`
    );
  } else {
    lines.push(`Este PR modifica **${context.files.length} arquivo(s)**.`);
  }

  lines.push("");
  lines.push("---");

  // Add each agent's feedback
  for (const result of agentResults) {
    lines.push("");
    lines.push(formatAgentSection(result));
    lines.push("");
    lines.push("---");
  }

  lines.push("");
  lines.push("*Revisao automatica por Claude. Revisao humana ainda e necessaria.*");

  return lines.join("\n");
}

/**
 * Format a single agent's section
 */
function formatAgentSection(result) {
  const lines = [];
  const icons = {
    payments: ":credit_card:",
    "design-system": ":art:",
    "best-practices": ":clipboard:",
  };

  const titles = {
    payments: "Payments Module",
    "design-system": "Design System",
    "best-practices": "Boas Praticas",
  };

  const reviewers = {
    payments: "@shipay/team-payments",
    "design-system": "@shipay/team-design",
    "best-practices": "@shipay/team-core",
  };

  const icon = icons[result.agent] || ":mag:";
  const title = titles[result.agent] || result.agent;
  const reviewer = reviewers[result.agent] || "";

  lines.push(`### ${icon} ${title}`);
  if (reviewer) {
    lines.push(`**Revisor:** ${reviewer}`);
  }
  lines.push("");

  const statusEmoji = {
    approved: ":white_check_mark: **Aprovado**",
    changes_requested: ":x: **Alteracoes Necessarias**",
    comment: ":white_check_mark: **Aprovado com sugestoes**",
  };

  lines.push(statusEmoji[result.status] || result.status);
  lines.push("");

  if (result.summary) {
    lines.push(result.summary);
    lines.push("");
  }

  if (result.findings && result.findings.length > 0) {
    lines.push("| Severidade | Descricao |");
    lines.push("|------------|-----------|");

    const severityIcons = {
      error: ":x: Erro",
      warning: ":warning: Atencao",
      suggestion: ":bulb: Sugestao",
    };

    for (const finding of result.findings) {
      const severity = severityIcons[finding.severity] || finding.severity;
      const location = finding.line
        ? `\`${finding.file}:${finding.line}\`: `
        : finding.file
          ? `\`${finding.file}\`: `
          : "";
      lines.push(`| ${severity} | ${location}${finding.message} |`);
    }
  }

  return lines.join("\n");
}

/**
 * Post a comment to the PR
 */
async function postComment(prNumber, comment) {
  // Check for existing AI review comments and update if found
  const existingComments = execSync(
    `gh pr view ${prNumber} --json comments --jq '.comments[] | select(.body | startswith("## :robot: AI Code Review")) | .id'`,
    { encoding: "utf-8" }
  ).trim();

  if (existingComments) {
    // Delete old comment(s) first
    const commentIds = existingComments.split("\n").filter((id) => id);
    for (const id of commentIds) {
      try {
        execSync(`gh api -X DELETE /repos/${process.env.GITHUB_REPOSITORY}/issues/comments/${id}`);
      } catch (e) {
        console.warn(`Could not delete old comment ${id}`);
      }
    }
  }

  // Create new comment
  const tempFile = path.join("/tmp", `ai-review-${Date.now()}.md`);
  fs.writeFileSync(tempFile, comment);

  execSync(`gh pr comment ${prNumber} --body-file "${tempFile}"`);

  fs.unlinkSync(tempFile);
}

main().catch((err) => {
  console.error("AI Code Review failed:", err);
  process.exit(1);
});
