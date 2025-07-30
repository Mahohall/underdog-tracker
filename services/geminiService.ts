
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

// Ensure the API key is available, but handle it gracefully if not
let apiKey = process.env.API_KEY;
if (!apiKey) {
  console.warn("API_KEY environment variable not set. Using a placeholder. Gemini API calls will fail.");
  apiKey = "YOUR_API_KEY_HERE"; // Placeholder
}

const ai = new GoogleGenAI({ apiKey });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    isNegative: {
      type: Type.BOOLEAN,
      description: "Is the headline negative for the team's performance? (e.g., injury, suspension, bad morale)"
    },
    reason: {
      type: Type.STRING,
      description: "Briefly explain why the headline is negative. If not negative, state 'No negative impact'."
    },
    impactScore: {
      type: Type.NUMBER,
      description: "On a scale of 1 (low impact) to 10 (high impact), how much could this affect the team's performance? 0 if not negative."
    }
  },
  required: ['isNegative', 'reason', 'impactScore']
};


const analyzeHeadline = async (teamName: string, headline: string, source: string): Promise<AnalysisResult | null> => {
   if (apiKey === "YOUR_API_KEY_HERE") {
    console.error("Cannot call Gemini API without a valid API_KEY.");
    // Simulate a non-negative response to allow UI to function
    return { isNegative: false, reason: "API key not configured.", impactScore: 0 };
  }
  
  try {
    const prompt = `Analyze the following football news headline about ${teamName} from the source: ${source}.
Determine if it's a negative factor for their upcoming match. Focus on key players injured, internal disputes, suspensions, or significant tactical issues.
Consider the source's reliability: a rumor from a fan account is less certain than an official club statement.
Ignore neutral or positive news.
Headline: "${headline}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        console.error("Gemini API returned an empty response.");
        return null;
    }
    
    const parsedJson = JSON.parse(jsonText) as AnalysisResult;
    return parsedJson;

  } catch (error) {
    console.error(`Gemini API Error for headline "${headline}":`, error);
    // Throw the error so it can be caught by the caller and displayed in the UI.
    throw new Error(`Failed to analyze headline for ${teamName}. Check browser console for details.`);
  }
};

export const geminiService = {
  analyzeHeadline
};
