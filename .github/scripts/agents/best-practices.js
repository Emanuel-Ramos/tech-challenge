/**
 * Best Practices Agent
 *
 * Reviews code for general best practices, security, and performance
 */

const { loadPrompt, callClaude, parseAgentResponse } = require("./claude-client");

/**
 * Run the best practices agent
 * @param {Object} context - PR context
 * @returns {Promise<Object>} Agent response with findings
 */
async function runBestPracticesAgent(context) {
  console.log("Running Best Practices Agent...");

  // Filter to TypeScript/JavaScript files
  const relevantFiles = context.files.filter(
    (f) =>
      f.filename.endsWith(".ts") ||
      f.filename.endsWith(".tsx") ||
      f.filename.endsWith(".js") ||
      f.filename.endsWith(".jsx")
  );

  if (relevantFiles.length === 0) {
    return {
      agent: "best-practices",
      status: "approved",
      findings: [],
      summary: "No TypeScript/JavaScript files to review.",
    };
  }

  try {
    const systemPrompt = loadPrompt("best-practices");
    const userMessage = formatContextForBestPractices(context, relevantFiles);
    const response = await callClaude(systemPrompt, userMessage);
    const parsed = parseAgentResponse(response, "best-practices");

    return {
      agent: "best-practices",
      status: parsed.status || "comment",
      findings: parsed.findings || [],
      summary: parsed.summary || "",
    };
  } catch (error) {
    console.error("Best Practices agent error:", error.message);
    return {
      agent: "best-practices",
      status: "comment",
      findings: [
        {
          severity: "warning",
          file: "",
          line: null,
          message: `Could not complete automated review: ${error.message}`,
        },
      ],
      summary: "Automated review could not be completed. Manual review required.",
    };
  }
}

/**
 * Format context for best practices review
 */
function formatContextForBestPractices(context, relevantFiles) {
  // Limit the number of files to avoid exceeding context limits
  const filesToReview = relevantFiles.slice(0, 20);

  const fileDetails = filesToReview
    .map((f) => {
      // Truncate very long patches
      const patch = f.patch.length > 3000 ? f.patch.slice(0, 3000) + "\n... (truncated)" : f.patch;

      return `
### ${f.filename}
Status: ${f.status}

\`\`\`diff
${patch}
\`\`\`
`;
    })
    .join("\n");

  const truncationNote =
    relevantFiles.length > 20
      ? `\n\n**Note:** Only showing first 20 of ${relevantFiles.length} files.`
      : "";

  return `
# PR #${context.number}: ${context.title}

## Description
${context.body || "No description provided."}

## Changed Files
${fileDetails}
${truncationNote}

Please review these changes focusing on:
1. TypeScript strict mode compliance
2. Security vulnerabilities (XSS, injection, etc.)
3. Performance issues (unnecessary re-renders, memory leaks)
4. Error handling
5. Code organization and patterns

Provide your response as JSON with status, findings, and summary.
`;
}

module.exports = {
  runBestPracticesAgent,
};
