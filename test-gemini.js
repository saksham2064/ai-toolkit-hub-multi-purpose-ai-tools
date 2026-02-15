import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: "AIzaSyCxVqPVbFv8SoAtVNoWYZ61rX7ZqkLIrgY"});

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-3-flash-preview",
//     contents: "Explain how AI works in a few words",
//   });
//   console.log(response.text);
// }

// await main();


// test-gemini.js


const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function run() {
  try {
    const response = await client.responses.create({
      model: 'gemini-1.5',
      input: 'Hello! Give me a short witty reply to: "Hey, what’s up?"',
    });

    console.log('AI Response:', response.output[0].content[0].text);
  } catch (err) {
    console.error('AI Error:', err);
  }
}

run();
