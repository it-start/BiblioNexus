import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AppLanguage, AnalysisData, ImageSize } from "../types";

// Helper to get API key securely
const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    console.error("API_KEY is missing in environment variables.");
    throw new Error("API Key is missing");
  }
  return key;
};

// Analysis Schema
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "A comprehensive executive summary of the topic in the requested language." },
    theological_insight: { type: Type.STRING, description: "Deep theological analysis and interpretation." },
    historical_context: { type: Type.STRING, description: "Historical and cultural context relevant to the topic." },
    citations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          book: { type: Type.STRING },
          chapter: { type: Type.INTEGER },
          verse_start: { type: Type.INTEGER },
          verse_end: { type: Type.INTEGER, nullable: true },
          text: { type: Type.STRING, description: "The actual scripture text." },
          relevance: { type: Type.STRING, description: "Why this verse is relevant to the topic." }
        },
        required: ["book", "chapter", "verse_start", "text", "relevance"]
      }
    },
    themes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          score: { type: Type.INTEGER, description: "Relevance score from 0 to 100" },
          description: { type: Type.STRING }
        },
        required: ["name", "score", "description"]
      }
    },
    relationships: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          source: { type: Type.STRING, description: "Name of person/entity" },
          target: { type: Type.STRING, description: "Name of related person/entity" },
          type: { type: Type.STRING, description: "Type of relationship (e.g., Father, Enemy, Ally)" },
          strength: { type: Type.INTEGER, description: "Strength of connection 1-10" }
        },
        required: ["source", "target", "type", "strength"]
      }
    }
  },
  required: ["summary", "theological_insight", "citations", "themes", "relationships", "historical_context"]
};

export const analyzeBibleTopic = async (topic: string, language: AppLanguage): Promise<AnalysisData> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
  const prompt = `
    Analyze the following biblical topic, person, or passage strictly based on the canonical Bible.
    Topic: "${topic}"
    Target Language: ${language}
    
    Requirements:
    1. Be strictly analytical and theological.
    2. Verify every citation. Do not hallucinate verses. If a verse is cited, it MUST exist.
    3. Provide historical context where applicable.
    4. For "relationships", map out key figures connected to this topic.
    5. Identify major themes and their prevalence intensity (score).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using high-reasoning model for strict analysis
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are a rigorous biblical scholar and data analyst. Your goal is to provide accurate, cited, and deep structured analysis of biblical entities. Never invent scripture.",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisData;
  } catch (error) {
    console.error("Analysis failed", error);
    throw error;
  }
};

export const generateBiblicalImage = async (prompt: string, size: ImageSize): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
  // Map size to supported API values if needed, or pass through if supported.
  // The user prompt specifically requested 1K, 2K, 4K affordance.
  // gemini-3-pro-image-preview supports these via 'imageSize' param.
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `A historically accurate, respectful, and cinematic biblical scene depiction: ${prompt}` }]
      },
      config: {
        imageConfig: {
            imageSize: size, // '1K' | '2K' | '4K'
            aspectRatio: "16:9" 
        }
      }
    });

    // Check for inline data
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data received");
  } catch (error) {
    console.error("Image generation failed", error);
    throw error;
  }
};

// Chat Service
export const createChatSession = () => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are a helpful Bible study assistant. Use the context of the Bible to answer questions. Be polite, wise, and provide verse references when possible.",
    }
  });
};
