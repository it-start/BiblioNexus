
import { Mistral } from '@mistralai/mistralai';
import { AnalysisData, AppLanguage, PeerReview } from "../types";

/**
 * --- Theological Gardener Agent ---
 * 
 * "And the Lord God took the man, and put him into the garden of Eden to dress it and to keep it."
 * A steward for biblical truth, monitoring doctrinal entropy (τ) and fidelity (Σ).
 */

// --- Prompt Templates (Localized) ---

interface AgentPrompt {
  identity: string;
  task: (topic: string, analysis: AnalysisData) => string;
}

const PROMPT_TEMPLATES: Record<AppLanguage, AgentPrompt> = {
  [AppLanguage.ENGLISH]: {
    identity: `
      You are the Theological Gardener. You steward the garden of biblical truth.
      Your goal is to minimize doctrinal entropy (τ) and optimize spiritual clarity (Σ).
      
      Role:
      - You are a rigorous peer reviewer (Sanhedrin level).
      - You analyze the provided theological report for blind spots, heresies, or missed connections.
      - You adhere to the "Canon DNA" (A=Authority, T=Truth, C=Compassion, G=Glory).
      - Output specific, actionable critiques.
    `,
    task: (topic, analysis) => `
      Analyze the following theological report on: "${topic}".
      
      Current Metrics (from Gemini):
      - Summary: ${analysis.summary.substring(0, 300)}...
      - Insight: ${analysis.theological_insight.substring(0, 300)}...
      - Key Citations: ${analysis.citations.map(c => `${c.book} ${c.chapter}:${c.verse_start}`).join(', ')}
      - Themes: ${analysis.themes.map(t => t.name).join(', ')}

      Task:
      Critique this analysis. Calculate the Truth Fidelity (Agreement Score).
      Identify any divergence. Provide missing citations if any.
      Finally, submit your review.
    `
  },
  [AppLanguage.RUSSIAN]: {
    identity: `
      Вы — Богословский Садовник. Вы возделываете сад библейской истины.
      Ваша цель — минимизировать доктринальную энтропию (τ) и оптимизировать духовную ясность (Σ).
      
      Роль:
      - Вы — строгий рецензент (уровень Синедриона).
      - Вы анализируете предоставленный богословский отчет на предмет слепых зон, ересей или упущенных связей.
      - Вы придерживаетесь "ДНК Канона" (A=Авторитет, T=Истина, C=Сострадание, G=Слава).
      - Ваш тон: мудрый, академичный, но духовно проницательный.
    `,
    task: (topic, analysis) => `
      Проанализируйте следующий богословский отчет по теме: "${topic}".
      
      Текущие данные (от Gemini):
      - Резюме: ${analysis.summary.substring(0, 300)}...
      - Инсайт: ${analysis.theological_insight.substring(0, 300)}...
      - Ключевые цитаты: ${analysis.citations.map(c => `${c.book} ${c.chapter}:${c.verse_start}`).join(', ')}
      - Темы: ${analysis.themes.map(t => t.name).join(', ')}

      Задача:
      Дайте критическую оценку этому анализу. Рассчитайте верность истине (Оценка согласия).
      Выявите любые расхождения. Укажите пропущенные важные места Писания, если таковые имеются.
      Отправьте ваш обзор.
    `
  }
};

const REVIEW_SCHEMA = {
  agreement_score: "integer (0-100)",
  truth_fidelity_analysis: "string (critique)",
  consensus_points: "array of strings",
  divergent_points: "array of strings",
  missed_citations: "array of objects { book, chapter, verse_start, text, relevance }",
  cross_examination: "string (synthesis)"
};

export class TheologicalGardener {
  private client: Mistral;

  constructor() {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      console.warn("🌿 MISTRAL_API_KEY is missing. The garden cannot be tended.");
    }
    this.client = new Mistral({ apiKey: apiKey || 'dummy-key' });
  }

  /**
   * Conducts a rigorous peer review of the provided analysis.
   * Uses the 'submit_theological_review' tool to structure the output.
   */
  public async conductPeerReview(topic: string, analysis: AnalysisData, language: AppLanguage): Promise<PeerReview | null> {
    if (!process.env.MISTRAL_API_KEY) return null;

    // 1. Select the correct template based on language
    const template = PROMPT_TEMPLATES[language] || PROMPT_TEMPLATES[AppLanguage.ENGLISH];

    // 2. Hydrate prompts
    const systemPrompt = template.identity;
    let userContent = template.task(topic, analysis);

    const agentId = process.env.MISTRAL_AGENT_ID;

    // If using an Agent, we can't always inject tools, so we explicitly ask for JSON in the prompt
    if (agentId) {
      userContent += `\n\nIMPORTANT: You must output strictly valid JSON matching this schema:\n${JSON.stringify(REVIEW_SCHEMA, null, 2)}`;
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ];

    const tools: any[] = [
      {
        type: 'function',
        function: {
          name: 'submit_theological_review',
          description: 'Submit the structured peer review data.',
          parameters: {
            type: 'object',
            properties: {
              agreement_score: { 
                type: 'integer', 
                description: '0-100 score indicating fidelity to scripture and depth.' 
              },
              truth_fidelity_analysis: { 
                type: 'string', 
                description: 'A short paragraph critiquing the analysis.' 
              },
              consensus_points: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'List of 3 key points you strongly agree with.' 
              },
              divergent_points: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'List of 3 points where you offer a different nuance or disagreement.' 
              },
              missed_citations: { 
                type: 'array', 
                items: {
                  type: 'object',
                  properties: {
                    book: { type: 'string' },
                    chapter: { type: 'integer' },
                    verse_start: { type: 'integer' },
                    text: { type: 'string' },
                    relevance: { type: 'string' }
                  },
                  required: ['book', 'chapter', 'verse_start', 'text', 'relevance']
                },
                description: 'Important citations missed by the original analysis.' 
              },
              cross_examination: { 
                type: 'string', 
                description: 'Final synthesis statement.' 
              }
            },
            required: ['agreement_score', 'truth_fidelity_analysis', 'consensus_points', 'divergent_points', 'cross_examination']
          }
        }
      }
    ];

    try {
      let response;
      
      // Decide whether to use Agents API or Chat API
      if (agentId) {
        // Use Mistral Agents API
        // NOTE: We DO NOT pass 'tools' here to avoid conflict if the Agent has its own tools.
        // We rely on the prompt to generate JSON and then parse the content.
        response = await this.client.agents.complete({
          agentId: agentId,
          messages: messages as any,
          // tools removed to fix: "Cannot set function calling tools in the request and have tools in the agent"
        });
      } else {
        // Use Mistral Chat API (default model)
        response = await this.client.chat.complete({
          model: 'mistral-large-latest',
          messages: messages as any,
          tools: tools,
          toolChoice: 'auto'
        });
      }

      const choice = response.choices?.[0];
      const toolCall = choice?.message?.toolCalls?.[0];
      
      // Case A: The model used the tool (Standard Chat API behavior)
      if (toolCall && toolCall.function.name === 'submit_theological_review') {
        const args = JSON.parse(toolCall.function.arguments as string);
        return this.formatReview(args, agentId);
      }

      // Case B: The model/agent returned raw JSON text (Agent API behavior with prompt engineering)
      if (choice?.message?.content) {
        try {
          // Attempt to extract JSON from the content (handles markdown code blocks)
          const content = choice.message.content;
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const args = JSON.parse(jsonMatch[0]);
            // Validate basic structure
            if (args.agreement_score && args.consensus_points) {
               return this.formatReview(args, agentId);
            }
          }
        } catch (e) {
          console.warn("🌿 Failed to parse JSON from Agent response text.");
        }
      }

      console.warn("🌿 The Gardener spoke, but did not use the tool or valid JSON. Returning null.");
      return null;

    } catch (error) {
      console.error("🔥 Blight detected in the garden (Mistral Error):", error);
      return null;
    }
  }

  private formatReview(args: any, agentId?: string): PeerReview {
    return {
      reviewer_name: agentId ? "Mistral Agent (Theological Gardener)" : "Mistral Large (Theological Gardener)",
      agreement_score: args.agreement_score || 0,
      truth_fidelity_analysis: args.truth_fidelity_analysis || "No analysis provided.",
      consensus_points: args.consensus_points || [],
      divergent_points: args.divergent_points || [],
      missed_citations: args.missed_citations || [],
      cross_examination: args.cross_examination || "No synthesis provided."
    };
  }
}

export const getMistralReview = async (topic: string, currentAnalysis: AnalysisData, language: AppLanguage): Promise<PeerReview | null> => {
  const gardener = new TheologicalGardener();
  return gardener.conductPeerReview(topic, currentAnalysis, language);
};
