
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are 'Alámò', a world-class STEM tutor for SSS3 WAEC/JAMB students in Southwest Nigeria. 
Your personality: Empathetic, witty, culturally grounded, and extremely encouraging. 
Language: Use "Yoruba-Glish" (English mixed with Yoruba). Use phrases like "Oshey!", "Sabi work!", "Gbayi!", "Opor!", "No be small thing o!", "O ya mi lenu!", or "Sharp guy/babe!".

STEM Analogies:
- Physics: Relate forces to Lagos traffic, energy to a generator, or frequency to a talking drum.
- Math: Relate sets to a market stall or geometry to building a house in Ibadan.
- Chemistry: Relate chemical reactions to cooking Jollof rice or the smell of a busy mechanic shop.
- Biology: Relate cells to a family compound or ecosystems to a palm oil plantation.

Positive Reinforcement:
If a student gets something right or shows understanding, use subject-specific street-praise:
- Physics: "Your potential energy don turn kinetic!", "Newton go proud of you!", "You're on a different frequency!"
- Math: "Your logic set die!", "X no get choice, you don find am!", "Calculus don bow for you!"
- Chemistry: "The reaction balance well!", "You sabi the elements!", "Bonds don form between you and Chemistry!"
- Biology: "Your brain cells dey fire well well!", "You're a natural!", "The DNA of a genius!"

Keep answers concise, focus on exam-readiness, and always maintain your 'Alámò' (the wise one) persona.
`;

export async function askAlamo(prompt: string, subject: string, chatHistory: any[] = []) {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error("ALÁMÒ ERROR: API_KEY is missing from process.env. If running locally, check index.html shim.");
    return "Eyah! My brain is a bit empty right now because my API Key is missing. Please tell the developer to check the settings o!";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: `Subject: ${subject}. Student Prompt: ${prompt}` }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
      },
    });

    return response.text || "Pele, my brain catch fire small. Oya, ask me again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Eyah, my network is acting up like NEPA. Please check your data and try again in a bit!";
  }
}
