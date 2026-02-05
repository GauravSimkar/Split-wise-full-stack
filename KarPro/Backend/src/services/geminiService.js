import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemma-3-1b-it"
});

export const askGemini = async (prompt) => {
  const result = await model.generateContent(prompt);
  return result.response.text();
};
