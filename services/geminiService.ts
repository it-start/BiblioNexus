
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AppLanguage, AnalysisData, ImageSize } from "../types";

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
          primary_verse: { type: Type.STRING, description: "The starting verse reference (e.g. Isaiah 53:5)" },
          primary_text: { type: Type.STRING, description: "The actual text content of the primary verse." },
          related_verse: { type: Type.STRING, description: "The connected verse reference (e.g. 1 Peter 2:24)" },
          related_text: { type: Type.STRING, description: "The actual text content of the related verse." },
          connection_type: { type: Type.STRING, description: "Specific nature of the link: 'Prophecy Fulfillment', 'Typology', 'Direct Quote', 'Thematic Echo', 'Contrast'" },
          description: { type: Type.STRING, description: "Explanation of the theological connection." }
        },
        required: ["primary_verse", "primary_text", "related_verse", "related_text", "connection_type", "description"]
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
    },
    locations: {
      type: Type.ARRAY,
      description: "Key geographical locations associated with the topic, including coordinates.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          latitude: { type: Type.NUMBER, description: "Decimal latitude" },
          longitude: { type: Type.NUMBER, description: "Decimal longitude" },
          description: { type: Type.STRING, description: "Brief description of the location in this context" },
          significance: { type: Type.STRING, description: "Why is this place important?" },
          associated_figures: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key biblical figures associated with this location" },
          associated_themes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Themes connected to this place" }
        },
        required: ["name", "latitude", "longitude", "description", "significance"]
      }
    },
    key_figures: {
      type: Type.ARRAY,
      description: "List of key people or entities mentioned in the relationships, with descriptions.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          role: { type: Type.STRING, description: "Role e.g. King, Prophet, Location, Concept" },
          description: { type: Type.STRING, description: "Brief bio or definition in context." }
        },
        required: ["name", "role", "description"]
      }
    },
    algorithmic_analysis: {
      type: Type.OBJECT,
      description: "Analyze the topic as if it were computer code or an algorithm (Bible as Code).",
      properties: {
        variables: {
          type: Type.ARRAY,
          items: {
             type: Type.OBJECT,
             properties: {
               name: { type: Type.STRING, description: "Variable name (e.g., HeartState, Covenant)" },
               type: { type: Type.STRING, enum: ['constant', 'mutable', 'global'] },
               value: { type: Type.STRING, description: "Current value or state description" },
               description: { type: Type.STRING }
             },
             required: ["name", "type", "value", "description"]
          }
        },
        logic_flow: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ['condition', 'loop', 'action', 'assignment'] },
              code: { type: Type.STRING, description: "Pseudocode representation (e.g. while(sin) { judgment++ })" },
              explanation: { type: Type.STRING, description: "Theological explanation of this logic step" },
              indent_level: { type: Type.INTEGER, description: "0 for root, 1 for nested, etc." }
            },
            required: ["type", "code", "explanation", "indent_level"]
          }
        }
      },
      required: ["variables", "logic_flow"]
    },
    bio_theology: {
      type: Type.OBJECT,
      description: "Map the topic to a DNA/RNA genetic sequence metaphor (Bible as DNA).",
      properties: {
        sequence_data: {
          type: Type.ARRAY,
          description: "A sequence of 8-12 bases mapped from the text.",
          items: {
            type: Type.OBJECT,
            properties: {
              nucleotide: { type: Type.STRING, enum: ['A', 'C', 'G', 'T', 'U'] },
              concept: { type: Type.STRING, description: "The concept this base represents (e.g. Authority, Grace)" },
              snippet: { type: Type.STRING, description: "The specific word/phrase from scripture" }
            },
            required: ["nucleotide", "concept", "snippet"]
          }
        },
        codons: {
          type: Type.ARRAY,
          description: "Groupings of 3 bases that produce a 'spiritual amino acid'.",
          items: {
            type: Type.OBJECT,
            properties: {
              sequence: { type: Type.STRING, description: "e.g. ACG" },
              amino_acid: { type: Type.STRING, description: "The resulting spiritual product (e.g. 'Redemption')" },
              description: { type: Type.STRING, description: "How these 3 concepts combine" }
            },
            required: ["sequence", "amino_acid", "description"]
          }
        },
        summary: { type: Type.STRING, description: "Overview of this genetic/theological structure." }
      },
      required: ["sequence_data", "codons", "summary"]
    },
    etymology: {
      type: Type.OBJECT,
      description: "Etymological Spectrometry: Breakdown of the topic into original Hebrew/Greek roots (Source Code).",
      properties: {
        target_word: { type: Type.STRING, description: "The main concept being analyzed (e.g. Love, Sin)" },
        roots: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              original_word: { type: Type.STRING, description: "Original word in Hebrew/Greek alphabet" },
              language: { type: Type.STRING, enum: ['Hebrew', 'Greek', 'Aramaic'] },
              transliteration: { type: Type.STRING, description: "English phonetic spelling" },
              meaning: { type: Type.STRING, description: "Literal definition of the root" },
              usage_count: { type: Type.INTEGER, description: "Approximate occurrences in the Bible" },
              usage_context: { type: Type.STRING, description: "Where else this word is used (e.g. 'Used in Psalms for...')"}
            },
            required: ["original_word", "language", "transliteration", "meaning", "usage_count", "usage_context"]
          }
        },
        synthesis: { type: Type.STRING, description: "How these diverse roots combine to form the full biblical concept." }
      },
      required: ["target_word", "roots", "synthesis"]
    }
  },
  required: ["summary", "theological_insight", "citations", "themes", "relationships", "cross_references", "historical_context", "timeline", "locations", "key_figures", "algorithmic_analysis", "bio_theology", "etymology"]
};

export const analyzeBibleTopic = async (topic: string, language: AppLanguage): Promise<AnalysisData> => {
  // Fix: Use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
       - IMPORTANT: Provide the ACTUAL TEXT for both the primary and related verses so we can analyze the shared words.
    7. For "timeline", provide a chronological list of 3-7 key historical events directly related to the topic.
    8. For "locations", identify up to 5 key geographical places associated with this topic. Provide accurate coordinates (approximate for ancient sites if necessary) and list associated figures and themes for map overlaying.
    9. For "key_figures", provide a brief list of the main entities mentioned in the relationships section, with their role and a short description.
    10. For "algorithmic_analysis", abstract the theological logic of the topic into pseudocode variables and flow control.
    11. For "bio_theology", perform a "Genetic Analysis" of the text. Map the theological DNA:
        - Use these Bases:
          * A (Adenine) = Authority / Law / Father / Sovereignty
          * C (Cytosine) = Compassion / Grace / Son / Mercy
          * G (Guanine) = Glory / Spirit / Life / Power
          * T (Thymine) = Truth / Word / Testimony / Logos
        - Extract a sequence of 8-12 bases from the topic's core scriptures.
        - Group them into "Codons" (triplets) and define what "Spiritual Amino Acid" (Result) they produce.
    12. For "etymology" (Spectrometry), perform a "Source Code" analysis.
        - Identify the primary English/Russian concept.
        - Break it down into its underlying Hebrew (OT) and Greek (NT) root words ("Isotopes").
        - For example, if the topic is "Love", analyze *Ahavah*, *Hesed* (Hebrew) and *Agape*, *Phileo* (Greek).
        - Explain the nuance of each root and how often it appears.
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
  // Fix: Use process.env.API_KEY directly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
export const createChatSession = (language: AppLanguage) => {
  // Fix: Use process.env.API_KEY directly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const instruction = language === AppLanguage.RUSSIAN
    ? "Вы — полезный помощник по изучению Библии. Используйте контекст Библии для ответов на вопросы. Будьте вежливы, мудры и по возможности предоставляйте ссылки на стихи. Отвечайте на русском языке."
    : "You are a helpful Bible study assistant. Use the context of the Bible to answer questions. Be polite, wise, and provide verse references when possible.";

  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: instruction,
    }
  });
};
