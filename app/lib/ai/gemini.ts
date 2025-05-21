import { GoogleGenerativeAI } from '@google/generative-ai';
import { model } from '../types/config'
// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Get the generative model


export async function getAIResponse(prompt: string): Promise<string> {
  try {
    console.log('Sending prompt to Gemini:', prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Received response from Gemini:', text);
    return text;
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw error;
  }
} 