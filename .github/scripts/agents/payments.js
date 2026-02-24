/**
 * Payments Agent
 *
 * Specialist agent for reviewing payments-related code
 */

const { loadPrompt, callClaude, parseAgentResponse } = require("./claude-client");

/**
 * Run the payments specialist agent
 * @param {Object} context - PR context
 * @returns {Promise<Object>} Agent response with findings
 */
async function runPaymentsAgent(context) {
  console.log("Running Payments Agent...");

  // Filter to only payments-related files
  const relevantFiles = context.files.filter(
    (f) =>
      f.filename.startsWith("packages/payments-module/") ||
      f.filename.includes("payment") ||
      f.filename.includes("transaction")
  );

  if (relevantFiles.length === 0) {
    return {
      agent: "payments",
      status: "approved",
      findings: [],
      summary: "No payments-related code changes detected.",
    };
  }

  try {
    const systemPrompt = loadPrompt("payments");
    const userMessage = formatContextForPayments(context, relevantFiles);
    const response = await callClaude(systemPrompt, userMessage);
    const parsed = parseAgentResponse(response, "payments");

    return {
      agent: "payments",
      status: parsed.status || "comment",
      findings: parsed.findings || [],
      summary: parsed.summary || "",
    };
  } catch (error) {
    console.error("Payments agent error:", error.message);
    return {
      agent: "payments",
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
 * Format context specifically for payments review
 */
function formatContextForPayments(context, relevantFiles) {
  const fileDetails = relevantFiles
    .map((f) => {
      return `
### ${f.filename}
Status: ${f.status}

\`\`\`diff
${f.patch}
\`\`\`
`;
    })
    .join("\n");

  return `
# PR #${context.number}: ${context.title}

## Description
${context.body || "No description provided."}

## Changed Files in Payments Module

${fileDetails}

Please review these changes focusing on:
1. Payment logic correctness
2. Transaction error handling
3. Currency/value formatting
4. Security considerations

Provide your response as JSON with status, findings, and summary.
`;
}

module.exports = {
  runPaymentsAgent,
};
