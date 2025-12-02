
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AppLanguage, AnalysisData, ImageSize, CouncilSession } from "../types";

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
    },
    chrono_spatial: {
      type: Type.OBJECT,
      description: "4D Chrono-Spatial Reconstruction: Evolution of the main geographical location over time.",
      properties: {
        location_name: { type: Type.STRING, description: "Name of the primary city/location (e.g. Jerusalem, Babylon)" },
        eras: {
          type: Type.ARRAY,
          description: "3 distinct historical eras relevant to the location (e.g. Bronze Age, Iron Age, Roman Era).",
          items: {
            type: Type.OBJECT,
            properties: {
              era_name: { type: Type.STRING, description: "e.g. 'Solomonic Era' or 'Second Temple Period'" },
              year_range: { type: Type.STRING, description: "e.g. 'c. 970-930 BC'" },
              description: { type: Type.STRING, description: "How the city looked and functioned in this specific era." },
              city_center: {
                type: Type.OBJECT,
                properties: {
                  lat: { type: Type.NUMBER },
                  lng: { type: Type.NUMBER }
                },
                required: ["lat", "lng"]
              },
              city_radius: { type: Type.NUMBER, description: "Approximate radius of the city limits in meters during this era." },
              features: {
                type: Type.ARRAY,
                description: "Key structures or landmarks visible in THIS specific era.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['structure', 'natural', 'event'] },
                    latitude: { type: Type.NUMBER },
                    longitude: { type: Type.NUMBER },
                    description: { type: Type.STRING }
                  },
                  required: ["name", "type", "latitude", "longitude", "description"]
                }
              }
            },
            required: ["era_name", "year_range", "description", "city_center", "city_radius", "features"]
          }
        }
      },
      required: ["location_name", "eras"]
    }
  },
  required: ["summary", "theological_insight", "citations", "themes", "relationships", "cross_references", "historical_context", "timeline", "locations", "key_figures", "algorithmic_analysis", "bio_theology", "etymology", "chrono_spatial"]
};

// Council Session Schema
const councilSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING },
    debate_transcript: {
      type: Type.ARRAY,
      description: "The turn-by-turn debate script between the council members.",
      items: {
        type: Type.OBJECT,
        properties: {
          speaker: { type: Type.STRING, enum: ['Archaeologist', 'Theologian', 'Mystic'] },
          content: { type: Type.STRING, description: "The argument or statement made by the speaker." },
          tone: { type: Type.STRING, enum: ['analytical', 'skeptical', 'reverent', 'passionate', 'firm'] }
        },
        required: ["speaker", "content", "tone"]
      }
    },
    verdict: {
      type: Type.OBJECT,
      properties: {
        agreement_statement: { type: Type.STRING, description: "The final synthesis statement agreed upon by the council." },
        pending_questions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Questions or mysteries that remain unresolved." }
      },
      required: ["agreement_statement", "pending_questions"]
    }
  },
  required: ["topic", "debate_transcript", "verdict"]
};

// --- PROMPTS ---

const GEMINI_PROMPTS = {
  [AppLanguage.ENGLISH]: {
    system_analysis: "You are a rigorous biblical scholar and data analyst. Your goal is to provide accurate, cited, and deep structured analysis of biblical entities. Never invent scripture. Focus on the organic unity of the Bible.",
    system_council: "You are the Recording Scribe for the High Council of Biblical Studies. Transcribe the debate faithfully.",
    system_chat: "You are a helpful Bible study assistant. Use the context of the Bible to answer questions. Be polite, wise, and provide verse references when possible.",
    image_style: "A historically accurate, respectful, and cinematic biblical scene depiction: ",
    analysis_task: (topic: string) => `
      Analyze the following biblical topic strictly based on the canonical Bible.
      Topic: "${topic}"
      
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
      10. For "algorithmic_analysis", abstract the theological logic of the topic into pseudocode variables and flow control (Bible as Code).
      11. For "bio_theology", perform a "Genetic Analysis" of the text. Map the theological DNA (A/C/G/T).
      12. For "etymology" (Spectrometry), perform a "Source Code" analysis of key Hebrew/Greek words.
      13. For "chrono_spatial" (Time Travel Map): 
          - If the topic involves a specific city or location (e.g. Jerusalem, Babylon), perform a 4D reconstruction.
          - Define 3 distinct Historical Eras (e.g. Davidic, Solomonic, Roman).
          - For EACH era, provide the specific latitude/longitude center and city radius.
          - List 3-5 key structures visible in that specific era.
    `,
    council_task: (topic: string) => `
      Convene the 'Council of Three' to debate the theological topic: "${topic}".

      You must simulate a high-level, academic, and spiritual debate between these three personas:

      1. The Archaeologist (Dr. Stone):
         - Focus: Physical evidence, geography, carbon dating, ancient Near Eastern customs.
         - Motto: "If I can't dig it up, I'm skeptical."
         - Tone: Analytical, grounded, fact-obsessed.

      2. The Systematician (The Logician):
         - Focus: Doctrinal consistency, cross-references, logic, preventing heresy.
         - Motto: "Scripture cannot contradict Scripture."
         - Tone: Strict, precise, authoritative, logical.

      3. The Mystic (The Poet):
         - Focus: Typology, shadows, emotional resonance, the "Spirit" of the text.
         - Motto: "The letter kills, but the Spirit gives life."
         - Tone: Ethereal, passionate, metaphorical, deep.

      Process:
      - Generate a transcript of 5-7 turns where they discuss/argue about the topic.
      - They should critique each other's viewpoints.
      - Finally, they must arrive at a 'Consensus Statement' (Verdict) that synthesizes their views into a higher truth.
    `
  },
  [AppLanguage.RUSSIAN]: {
    system_analysis: "Вы — строгий библейский исследователь и аналитик данных. Ваша цель — предоставить точный, цитируемый и глубокий структурный анализ библейских сущностей. Никогда не выдумывайте писание. Сосредоточьтесь на органическом единстве Библии.",
    system_council: "Вы — Секретарь Высшего Совета библейских исследований. Верно стенографируйте дебаты.",
    system_chat: "Вы — полезный помощник по изучению Библии. Используйте контекст Библии для ответов на вопросы. Будьте вежливы, мудры и по возможности предоставляйте ссылки на стихи. Отвечайте на русском языке.",
    image_style: "Исторически достоверное, уважительное и кинематографичное изображение библейской сцены: ",
    analysis_task: (topic: string) => `
      Проанализируйте следующую библейскую тему строго на основе канонической Библии.
      Тема: "${topic}"
      
      Требования:
      1. Будьте строго аналитичны и богословски точны.
      2. Проверяйте каждую цитату. Не выдумывайте стихи. Если стих указан, он ДОЛЖЕН существовать.
      3. Предоставьте исторический контекст.
      4. Для "relationships" (связи) укажите ключевые фигуры, связанные с этой темой.
      5. Определите основные темы (themes) и их интенсивность (score).
      6. Для "cross_references" (перекрестные ссылки) найдите глубокие, специфические связи. "Писание толкует Писание".
         - Ищите пророчества Ветхого Завета, исполненные в Новом.
         - Ищите Типологию (тени против сущности).
         - Ищите прямые цитаты.
         - ВАЖНО: Предоставьте ФАКТИЧЕСКИЙ ТЕКСТ (primary_text / related_text) для анализа общих слов.
      7. Для "timeline", предоставьте хронологический список 3-7 ключевых событий.
      8. Для "locations", определите до 5 ключевых географических мест.
      9. Для "key_figures", предоставьте краткий список главных действующих лиц.
      10. Для "algorithmic_analysis", абстрагируйте богословскую логику в псевдокод (Библия как код).
      11. Для "bio_theology", проведите "Генетический анализ" текста. Картируйте богословскую ДНК (A/C/G/T).
      12. Для "etymology", проведите анализ "Исходного кода" (иврит/греческий).
      13. Для "chrono_spatial" (4D Карта):
          - Если тема связана с городом (напр., Иерусалим), проведите 4D реконструкцию.
          - Определите 3 исторические эпохи.
          - Для КАЖДОЙ эпохи укажите центр и радиус города.
          - Укажите 3-5 ключевых строений, видимых в эту эпоху.
    `,
    council_task: (topic: string) => `
      Созовите 'Совет Трех' для дебатов на богословскую тему: "${topic}".

      Вы должны симулировать высокий академический и духовный спор между тремя персонами:

      1. Археолог (Доктор Стоун):
         - Фокус: Физические доказательства, география, датировка, обычаи Ближнего Востока.
         - Девиз: "Если я не могу это раскопать, я скептичен."
         - Тон: Аналитический, приземленный, одержимый фактами.

      2. Систематик (Логик):
         - Фокус: Доктринальная последовательность, перекрестные ссылки, логика, предотвращение ереси.
         - Девиз: "Писание не может противоречить Писанию."
         - Тон: Строгий, точный, авторитетный, логичный.

      3. Мистик (Поэт):
         - Фокус: Типология, тени, эмоциональный резонанс, "Дух" текста.
         - Девиз: "Буква убивает, а Дух животворит."
         - Тон: Неземной, страстный, метафоричный, глубокий.

      Процесс:
      - Сгенерируйте стенограмму из 5-7 реплик, где они обсуждают тему.
      - Они должны критиковать точки зрения друг друга.
      - В конце они должны прийти к 'Заявлению о Консенсусе' (Вердикт), которое синтезирует их взгляды в высшую истину.
    `
  }
};

export const analyzeBibleTopic = async (topic: string, language: AppLanguage): Promise<AnalysisData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const template = GEMINI_PROMPTS[language] || GEMINI_PROMPTS[AppLanguage.ENGLISH];
  const prompt = template.analysis_task(topic);

  const config = {
    responseMimeType: "application/json",
    responseSchema: analysisSchema,
    systemInstruction: template.system_analysis,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: prompt,
      config: config
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisData;
  } catch (error) {
    console.warn("Primary model failed, attempting fallback to Gemini 2.5 Flash", error);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: config
      });
      
      const text = response.text;
      if (!text) throw new Error("No response from AI (Fallback)");
      return JSON.parse(text) as AnalysisData;
    } catch (fallbackError) {
      console.error("Analysis failed (Primary & Fallback)", fallbackError);
      throw fallbackError;
    }
  }
};

export const conveneCouncil = async (topic: string, language: AppLanguage): Promise<CouncilSession> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const template = GEMINI_PROMPTS[language] || GEMINI_PROMPTS[AppLanguage.ENGLISH];
  const prompt = template.council_task(topic);

  const config = {
    responseMimeType: "application/json",
    responseSchema: councilSchema,
    systemInstruction: template.system_council,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: config
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI for Council");

    return JSON.parse(text) as CouncilSession;
  } catch (error) {
    console.warn("Council Session failed, attempting fallback to Gemini 2.5 Flash", error);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: config
      });
      
      const text = response.text;
      if (!text) throw new Error("No response from AI for Council (Fallback)");
      return JSON.parse(text) as CouncilSession;
    } catch (fallbackError) {
       console.error("Council Session failed (Primary & Fallback)", fallbackError);
       throw fallbackError;
    }
  }
};

export const generateBiblicalImage = async (prompt: string, size: ImageSize, language: AppLanguage = AppLanguage.ENGLISH): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const template = GEMINI_PROMPTS[language] || GEMINI_PROMPTS[AppLanguage.ENGLISH];
  const fullPrompt = `${template.image_style} ${prompt}`;
  
  const textContent = { text: fullPrompt };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [textContent]
      },
      config: {
        imageConfig: {
            imageSize: size, 
            aspectRatio: "16:9" 
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data received");
  } catch (error) {
    console.warn("Image generation failed, attempting fallback", error);
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image', 
            contents: { parts: [textContent] },
            config: {
                imageConfig: { aspectRatio: "16:9" }
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image data received from fallback");
    } catch (fallbackError) {
        console.error("Image generation failed", fallbackError);
        throw fallbackError;
    }
  }
};

export const createChatSession = (language: AppLanguage) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const template = GEMINI_PROMPTS[language] || GEMINI_PROMPTS[AppLanguage.ENGLISH];

  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: template.system_chat,
    }
  });
};
