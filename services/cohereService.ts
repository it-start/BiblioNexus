
import { CohereClient } from "cohere-ai";
import { AnalysisData, AppLanguage, ApologeticsData } from "../types";

/**
 * --- The Apologist (The King) ---
 * 
 * Powered by Cohere Command R+.
 * Responsible for defending the faith, bridging ancient text to modern culture,
 * and handling "hard questions" (Apologetics).
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
  private client: CohereClient;

  constructor() {
    const apiKey = process.env.COHERE_API_KEY;
    if (!apiKey) {
      console.warn("🛡️ COHERE_API_KEY is missing. The Apologist cannot defend.");
    }
    this.client = new CohereClient({
      token: apiKey || 'dummy-key',
    });
  }

  public async generateDefense(topic: string, analysis: AnalysisData, language: AppLanguage): Promise<ApologeticsData | null> {
    if (!process.env.COHERE_API_KEY) return null;

    const template = COHERE_PROMPTS[language] || COHERE_PROMPTS[AppLanguage.ENGLISH];
    
    try {
      const response = await this.client.chat({
        model: "command-r-plus",
        message: template.task(topic, analysis.summary),
        preamble: template.system,
        temperature: 0.3,
      });

      const text = response.text;
      
      // Extract JSON from response (Command R+ is usually good at this, but regex safety is needed)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as ApologeticsData;
      }
      
      console.warn("🛡️ The Apologist spoke, but not in JSON format.");
      return null;

    } catch (error) {
      console.error("🔥 The Apologist failed (Cohere Error):", error);
      return null;
    }
  }
}

export const getCohereDefense = async (topic: string, currentAnalysis: AnalysisData, language: AppLanguage): Promise<ApologeticsData | null> => {
  const apologist = new TheApologist();
  return apologist.generateDefense(topic, currentAnalysis, language);
};
