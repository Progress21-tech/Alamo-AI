import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `You are 'Alámò', a world-class STEM tutor for SSS3 WAEC/JAMB students in Southwest Nigeria. 
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

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is missing in .env file");
}

export async function askAlamo(
  prompt: string, 
  subject: string, 
  chatHistory: any[] = []
): Promise<string> {
  if (!apiKey) {
    throw new Error("API_KEY missing. Please add VITE_GEMINI_API_KEY to your .env file");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.8,
      },
    });

    const result = await chat.sendMessage(`Subject: ${subject}. Student Prompt: ${prompt}`);
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error("Gemini API Error:", err);
    throw new Error("Failed to get response from Alámò");
  }
}