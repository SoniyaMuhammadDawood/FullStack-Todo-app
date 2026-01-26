// geminiService.ts
import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBzQcY6-ouwbbYreYHZY2DToUeOWYABxfI';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

interface GeminiRequest {
  contents: Array<{
    role: string;
    parts: Array<{
      text: string;
    }>;
  }>;
}

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  promptFeedback?: {
    blockReason: string;
  };
}

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const requestBody: GeminiRequest = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: message
            }
          ]
        }
      ]
    };

    const response = await axios.post<GeminiResponse>(GEMINI_API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.promptFeedback?.blockReason) {
      throw new Error(`Request blocked due to: ${response.data.promptFeedback.blockReason}`);
    }

    if (!response.data.candidates || response.data.candidates.length === 0) {
      throw new Error('No candidates returned from Gemini API');
    }

    const candidate = response.data.candidates[0];
    if (!candidate.content.parts || candidate.content.parts.length === 0) {
      throw new Error('No content parts returned from Gemini API');
    }

    return candidate.content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to get response from Gemini API');
  }
};