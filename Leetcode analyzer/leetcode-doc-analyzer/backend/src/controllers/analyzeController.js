// src/controllers/analyzeController.js
import { openai } from "../config/openai.js";

export const analyzeCode = async (req, res) => {
  const { code, problemName, language } = req.body;
  console.log("Received /analyze-code request:", { code, problemName, language });

  if (!code || !problemName || !language) {
    return res.status(400).json({ error: "Code, Problem Name, and Language are required." });
  }

  try {
    const prompt = `
You are an expert in LeetCode coding analysis.
Analyze the following ${language} code for the problem "${problemName}" and return a structured JSON response ONLY in this format:

[
  { "title": "Time Complexity", "content": "O(n)" },
  { "title": "Space Complexity", "content": "O(1)" },
  { "title": "Algorithm Efficiency", "content": "Explanation..." },
  { "title": "Code Optimization", "content": "Suggested improvements..." }
]

IMPORTANT:
- Do NOT include any text outside of the JSON format.
- Do NOT wrap it in Markdown.
- Do NOT add any explanations or headers.

Code Submission:
\`\`\`${language}
${code}
\`\`\`
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.2,
    });

    console.log("Raw OpenAI Response:", response.choices[0].message.content);

    let analysis;
    try {
      analysis = JSON.parse(response.choices[0].message.content.trim());
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError);
      throw new Error("Invalid JSON format from AI.");
    }

    if (!Array.isArray(analysis)) {
      throw new Error("Unexpected response format from OpenAI.");
    }

    return res.json({ analysis });
  } catch (error) {
    console.error("Error calling OpenAI API:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to analyze code. Please try again later." });
  }
};

export const generateHint = async (req, res) => {
  const { code, problemName, language } = req.body;
  console.log("Received /generate-hint request:", { code, problemName, language });

  if (!code || !problemName || !language) {
    return res.status(400).json({ error: "Code, Problem Name, and Language are required." });
  }

  try {
    const prompt = `
You are an expert in LeetCode problem solving.
Provide a concise hint for the following ${language} code for the problem "${problemName}". The hint should be short (one or two sentences) and help the user understand a key aspect or potential improvement—without giving away the full solution.

Code Submission:
\`\`\`${language}
${code}
\`\`\`
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.5,
    });

    console.log("Raw OpenAI Hint Response:", response.choices[0].message.content);
    const hint = response.choices[0].message.content.trim();
    return res.json({ hint });
  } catch (error) {
    console.error("Error generating hint:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to generate hint. Please try again later." });
  }
};
