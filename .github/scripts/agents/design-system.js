/**
 * Design System Agent
 *
 * Specialist agent for reviewing design system components
 */

const { loadPrompt, callClaude, parseAgentResponse } = require("./claude-client");

/**
 * Run the design system specialist agent
 * @param {Object} context - PR context
 * @returns {Promise<Object>} Agent response with findings
 */
async function runDesignSystemAgent(context) {
  console.log("Running Design System Agent...");

  // Filter to only design system related files
  const relevantFiles = context.files.filter(
    (f) =>
      f.filename.startsWith("packages/design-system/") ||
      f.filename.includes("components/") ||
      f.filename.includes(".css") ||
      f.filename.includes("theme") ||
      f.filename.includes("tokens")
  );

  if (relevantFiles.length === 0) {
    return {
      agent: "design-system",
      status: "approved",
      findings: [],
      summary: "No design system changes detected.",
    };
  }

  try {
    const systemPrompt = loadPrompt("design-system");
    const userMessage = formatContextForDesignSystem(context, relevantFiles);
    const response = await callClaude(systemPrompt, userMessage);
    const parsed = parseAgentResponse(response, "design-system");

    return {
      agent: "design-system",
      status: parsed.status || "comment",
      findings: parsed.findings || [],
      summary: parsed.summary || "",
    };
  } catch (error) {
    console.error("Design System agent error:", error.message);
    return {
      agent: "design-system",
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
 * Format context specifically for design system review
 */
function formatContextForDesignSystem(context, relevantFiles) {
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

## Changed Files in Design System

${fileDetails}

Please review these changes focusing on:
1. Proper use of design tokens
2. Accessibility (ARIA attributes, keyboard navigation)
3. Component API consistency
4. Responsive design considerations
5. Theme compatibility

Provide your response as JSON with status, findings, and summary.
`;
}

module.exports = {
  runDesignSystemAgent,
};
