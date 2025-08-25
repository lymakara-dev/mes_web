// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";

// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async function main() {
//   const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//   // Generate content
//   const result = await model.generateContent(
//     "Explaine in datail of a fomular."
//   );

//   console.log(result.response.text());
// }

// await main();

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Guide me to learn new technology faster.",
  });
  console.log(response.text);
}

main();
