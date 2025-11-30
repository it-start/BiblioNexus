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
          strength: { type: Type.INTEGER, description: "Strength of connection 1-10" },
          description: { type: Type.STRING, description: "Brief context of this relationship", nullable: true }
        },
        required: ["source", "target", "type", "strength"]
      }
    },
    cross_references: {
      type: Type.ARRAY,
      description: "Deep links between different parts of the bible related to this topic (e.g., OT prophecy fulfilled in NT).",
      items: {
        type: Type.OBJECT,
        properties: {
          primary_verse: { type: Type.STRING, description: "The starting verse (e.g. Isaiah 53:5)" },
          related_verse: { type: Type.STRING, description: "The connected verse (e.g. 1 Peter 2:24)" },
          connection_type: { type: Type.STRING, description: "Specific nature of the link: 'Prophecy Fulfillment', 'Typology', 'Direct Quote', 'Thematic Echo', 'Contrast'" },
          description: { type: Type.STRING, description: "Explanation of the theological connection." }
        },
        required: ["primary_verse", "related_verse", "connection_type", "description"]
      }
    },
    timeline: {
      type: Type.ARRAY,
      description: "A chronological timeline of key historical events associated with this topic.",
      items: {
        type: Type.OBJECT,
        properties: {
            year: { type: Type.STRING, description: "The date/year (e.g. '1000 BC', 'c. 33 AD')" },
            event: { type: Type.STRING, description: "The event title" },
            description: { type: Type.STRING, description: "Short explanation of the event" }
        },
        required: ["year", "event", "description"]
      }
    }
  },
  required: ["summary", "theological_insight", "citations", "themes", "relationships", "cross_references", "historical_context", "timeline"]
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
    6. For "cross_references", find deep, specific connections. Focus on "Scripture interpreting Scripture". 
       - Look for Old Testament prophecies fulfilled in the New Testament.
       - Look for Typology (shadows vs substance).
       - Look for direct quotations.
       - Ensure the "connection_type" is descriptive.
    7. For "timeline", provide a chronological list of 3-7 key historical events directly related to the topic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using high-reasoning model for strict analysis
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are a rigorous biblical scholar and data analyst. Your goal is to provide accurate, cited, and deep structured analysis of biblical entities. Never invent scripture. Focus on the organic unity of the Bible.",
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
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `A historically accurate, respectful, and cinematic biblical scene depiction: ${prompt}` }]
      },
      config: {
        imageConfig: {
            imageSize: size, 
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