import { GoogleGenAI } from "@google/genai";

/**
 * Converts a File object to a Base64 string.
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Uses Gemini to extract structured content from a PDF.
 */
export const extractContentFromPdf = async (file: File): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const base64Data = await fileToBase64(file);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: base64Data
            }
          },
          {
            text: `You are a professional document conversion assistant. 
            Your task is to transcribe the content of this PDF into clean, well-structured Markdown.
            
            Rules:
            1. Preserve headers using Markdown syntax (# for Title, ## for H1, ### for H2, etc.).
            2. Preserve lists using - or 1. syntax.
            3. Preserve tables if possible using Markdown table syntax.
            4. Do not include any conversational filler (e.g., "Here is the converted text"). 
            5. Output ONLY the document content.
            6. If there are images, ignore them or denote them with [Image Placeholder].
            7. Ensure paragraphs are separated by a blank line.`
          }
        ]
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No content generated from Gemini.");
    }
    return text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze PDF. Please try again or check your API key.");
  }
};