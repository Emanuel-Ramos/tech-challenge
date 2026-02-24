/**
 * Claude API Client
 *
 * Shared utility for making calls to the Claude API
 */

const fs = require("fs");
const path = require("path");

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-3-5-sonnet-20241022";
const MAX_TOKENS = 4096;

/**
 * Load a prompt template from the prompts directory
 * @param {string} promptName - Name of the prompt file (without .md extension)
 * @returns {string} The prompt content
 */
function loadPrompt(promptName) {
  const promptPath = path.join(__dirname, "..", "prompts", `${promptName}.md`);
  return fs.readFileSync(promptPath, "utf-8");
}

/**
 * Call Claude API with a system prompt and user message
 * @param {string} systemPrompt - The system prompt
 * @param {string} userMessage - The user message containing PR context
 * @returns {Promise<string>} The assistant's response
 */
async function callClaude(systemPrompt, userMessage) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${error}`);
  }

  const data = await response.json();

  if (data.content && data.content.length > 0) {
    return data.content[0].text;
  }

  throw new Error("No content in Claude response");
}

/**
 * Parse agent response from Claude
 * Expected format is JSON with status, findings, and summary
 * @param {string} response - Raw response from Claude
 * @param {string} agentName - Name of the agent for fallback
 * @returns {Object} Parsed agent response
 */
function parseAgentResponse(response, agentName) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }

    // Try parsing the whole response as JSON
    return JSON.parse(response);
  } catch (e) {
    // If parsing fails, create a basic response from the text
    console.warn(`Could not parse JSON response from ${agentName}, using text response`);
    return {
      agent: agentName,
      status: "comment",
      findings: [],
      summary: response.slice(0, 500),
    };
  }
}

module.exports = {
  loadPrompt,
  callClaude,
  parseAgentResponse,
};
