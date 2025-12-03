
import { AnalysisData, AppLanguage, ApologeticsData } from "../types";

/**
 * --- The Apologist (The King) ---
 * 
 * Powered by Cohere Command R+.
 * Responsible for defending the faith, bridging ancient text to modern culture,
 * and handling "hard questions" (Apologetics).
 * 
 * Uses Cohere V2 API via fetch for browser compatibility.
 */

const COHERE_PROMPTS = {
  [AppLanguage.ENGLISH]: {
    system: "You are 'The Apologist', a brilliant modern philosopher and defender of biblical truth (Dr. R). Your task is to bridge the gap between ancient theology and the modern cultural zeitgeist. You address skeptics with respect but firm logic.",
    task: (topic: string, summary: string) => `
      Analyze the topic "${topic}" based on this theological summary: "${summary}".
      
      Generate a structured JSON response containing:
      1. "cultural_context": How this biblical concept interfaces with modern philosophy (e.g., Post-modernism, Secularism) or current cultural struggles.
      2. "hard_questions": Identify the top 2 toughest skeptical objections/contradictions to this topic and refute them logically with scripture.
      3. "ethical_imperative": A powerful, actionable "So What?" for the modern believer.
      
      Output strictly valid JSON.
    `
  },
  [AppLanguage.RUSSIAN]: {
    system: "Вы — 'Апологет', блестящий современный философ и защитник библейской истины. Ваша задача — перекинуть мост между древним богословием и современным культурным духом времени. Вы отвечаете скептикам с уважением, но твердой логикой.",
    task: (topic: string, summary: string) => `
      Проанализируйте тему "${topic}", основываясь на этом богословском резюме: "${summary}".
      
      Сгенерируйте структурированный JSON-ответ, содержащий:
      1. "cultural_context": Как эта библейская концепция соотносится с современной философией (например, постмодернизмом, секуляризмом) или актуальными культурными проблемами.
      2. "hard_questions": Определите 2 самых сложных скептических возражения/противоречия по этой теме и логически опровергните их с помощью Писания.
      3. "ethical_imperative": Мощный, действенный вывод ("И что теперь?") для современного верующего.
      
      Вывод строго в формате JSON.
    `
  }
};

export class TheApologist {
  private apiKey: string | undefined;

  constructor() {
    // Check both standard VITE_ prefix and standard NODE env vars
    this.apiKey = process.env.VITE_COHERE_API_KEY || process.env.COHERE_API_KEY;
    
    if (!this.apiKey) {
      console.warn("🛡️ COHERE_API_KEY is missing. The Apologist cannot defend.");
    }
  }

  public async generateDefense(topic: string, analysis: AnalysisData, language: AppLanguage): Promise<ApologeticsData | null> {
    if (!this.apiKey) return null;

    const template = COHERE_PROMPTS[language] || COHERE_PROMPTS[AppLanguage.ENGLISH];
    
    try {
      // Direct fetch to Cohere V2 API to avoid SDK 404s and browser polyfill issues
      // Endpoint: https://api.cohere.com/v2/chat
      const response = await fetch('https://api.cohere.com/v2/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Client-Name': 'BiblioNexus'
        },
        body: JSON.stringify({
          model: 'command-a-03-2025', // V2/V1 compatible high-reasoning model
          messages: [
            {
              role: 'system',
              content: template.system
            },
            {
              role: 'user',
              content: template.task(topic, analysis.summary),
            },
          ],
          temperature: 0.3,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        // If 404, it might mean the model isn't available in V2 or the endpoint changed, 
        // but api.cohere.com/v2/chat is standard.
        // If 401, key is wrong.
        throw new Error(`Cohere API Error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      
      // V2 Response structure: data.message.content[0].text
      let content: string | null = null;
      
      if (data.message?.content && Array.isArray(data.message.content)) {
        const textPart = data.message.content.find((p: any) => p.type === 'text');
        if (textPart) content = textPart.text;
      }

      if (!content) {
        throw new Error("Empty response content from Cohere");
      }
      
      // Parse JSON
      try {
          return JSON.parse(content) as ApologeticsData;
      } catch (e) {
          // If direct parse fails, try regex extraction
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]) as ApologeticsData;
          }
          throw e;
      }

    } catch (error) {
      console.error("🔥 The Apologist failed (Cohere Error):", error);
      console.warn("Attempting fallback...");
      return this.fallbackDefense(topic, analysis, language);
    }
  }

  private async fallbackDefense(topic: string, analysis: AnalysisData, language: AppLanguage): Promise<ApologeticsData | null> {
    if (!this.apiKey) return null;
    const template = COHERE_PROMPTS[language] || COHERE_PROMPTS[AppLanguage.ENGLISH];
    
    try {
        const response = await fetch('https://api.cohere.com/v2/chat', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'command-a-03-2025', // Fallback to lighter model
            messages: [
              { role: 'system', content: template.system },
              { role: 'user', content: template.task(topic, analysis.summary) }
            ],
            temperature: 0.3
          })
        });

        if (!response.ok) return null;
        
        const data = await response.json();
        let content: string | null = null;

        if (data.message?.content && Array.isArray(data.message.content)) {
            const textPart = data.message.content.find((p: any) => p.type === 'text');
            if (textPart) content = textPart.text;
        }

        if (!content) return null;

        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]) as ApologeticsData;
        }
        return null;
    } catch (e) {
        console.error("Cohere Fallback failed:", e);
        return null;
    }
  }
}

export const getCohereDefense = async (topic: string, currentAnalysis: AnalysisData, language: AppLanguage): Promise<ApologeticsData | null> => {
  const apologist = new TheApologist();
  return apologist.generateDefense(topic, currentAnalysis, language);
};
