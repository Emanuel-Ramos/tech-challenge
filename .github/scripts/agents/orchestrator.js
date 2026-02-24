/**
 * Orchestrator Agent
 *
 * Analyzes the PR context and determines which specialist agents to invoke
 */

const { loadPrompt, callClaude, parseAgentResponse } = require("./claude-client");

/**
 * Run the orchestrator to determine which agents should review the PR
 * @param {Object} context - PR context
 * @param {string[]} affectedPackages - List of affected packages
 * @returns {Promise<string[]>} List of agents to run
 */
async function runOrchestrator(context, affectedPackages) {
  const agents = new Set();

  // Rule-based routing first
  for (const pkg of affectedPackages) {
    switch (pkg) {
      case "payments-module":
        agents.add("payments");
        break;
      case "design-system":
        agents.add("design-system");
        break;
    }
  }

  // Check for TypeScript/TSX files - always run best practices
  const hasTypescriptFiles = context.files.some(
    (f) => f.filename.endsWith(".ts") || f.filename.endsWith(".tsx")
  );

  if (hasTypescriptFiles) {
    agents.add("best-practices");
  }

  // If no specific agents, at least run best practices
  if (agents.size === 0) {
    agents.add("best-practices");
  }

  // Optionally use Claude to make more nuanced decisions for complex PRs
  if (context.files.length > 10 || affectedPackages.length > 2) {
    try {
      const systemPrompt = loadPrompt("orchestrator");
      const userMessage = formatContextForOrchestrator(context, affectedPackages);
      const response = await callClaude(systemPrompt, userMessage);
      const parsed = parseAgentResponse(response, "orchestrator");

      if (parsed.agents && Array.isArray(parsed.agents)) {
        for (const agent of parsed.agents) {
          agents.add(agent);
        }
      }
    } catch (error) {
      console.warn("Orchestrator Claude call failed, using rule-based routing:", error.message);
    }
  }

  return Array.from(agents);
}

/**
 * Format PR context for the orchestrator
 */
function formatContextForOrchestrator(context, affectedPackages) {
  const fileList = context.files
    .map((f) => `- ${f.filename} (${f.status})`)
    .join("\n");

  return `
# PR #${context.number}: ${context.title}

## Affected Packages
${affectedPackages.join(", ") || "none"}

## Changed Files
${fileList}

## PR Description
${context.body || "No description provided."}

Please analyze this PR and determine which specialist agents should review it.
Return a JSON object with the list of agents to invoke.
`;
}

module.exports = {
  runOrchestrator,
};
