import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 6000;

// Middleware
app.use(bodyParser.json());

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Check that this is not undefined
});

app.post("/analyze-code", async (req, res) => {
  console.log("Endpoint hit");
  console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);

  const { code } = req.body;

  if (!code) {
    console.log("No code provided");
    return res.status(400).json({ error: "Code is required in the request body." });
  }

  try {
    console.log("Making OpenAI API call");
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `Analyze the following code and provide suggestions or insights:\n\n${code}`,
        },
      ],
      max_tokens: 200,
    });

    const analysis = response.choices[0].message.content.trim();
    console.log("API response received");
    res.json({ analysis });
  } catch (error) {
    console.error("Error calling OpenAI API:", error.message);
    res.status(500).json({ error: "Failed to analyze code. Please try again later." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
