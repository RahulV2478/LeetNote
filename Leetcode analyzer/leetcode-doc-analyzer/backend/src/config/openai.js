// src/config/openai.js
import OpenAI from "openai";

// By the time we get here, process.env should be loaded
export const openai = new OpenAI({
  apiKey: "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",
});
