
import { AnalysisData, AppLanguage, PeerReview } from "../types";

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

export const getMistralReview = async (topic: string, currentAnalysis: AnalysisData, language: AppLanguage): Promise<PeerReview | null> => {
  const apiKey = process.env.MISTRAL_API_KEY;
  
  if (!apiKey) {
    console.warn("Mistral API Key missing. Skipping peer review.");
    return null;
  }

  const systemPrompt = language === AppLanguage.RUSSIAN 
    ? "Вы — строгий библейский ученый и рецензент. Ваша задача — критически оценить предоставленный богословский анализ, найти упущенные моменты и предложить 'второе мнение' для установления истины."
    : "You are a rigorous biblical scholar and peer reviewer. Your task is to critically evaluate the provided theological analysis, identify blind spots, and provide a 'second opinion' to establish truth fidelity.";

  const analysisSummary = JSON.stringify({
    summary: currentAnalysis.summary,
    insight: currentAnalysis.theological_insight,
    citations: currentAnalysis.citations.map(c => `${c.book} ${c.chapter}:${c.verse_start}`),
    themes: currentAnalysis.themes.map(t => t.name)
  });

  const prompt = `
    Analyze the following theological report on the topic: "${topic}".
    
    Report Data:
    ${analysisSummary}

    Output a structured JSON review with the following fields:
    1. reviewer_name: "Mistral Large (Peer Review)"
    2. agreement_score: (0-100) How accurate and complete is the original analysis?
    3. truth_fidelity_analysis: A short paragraph critiquing the analysis.
    4. consensus_points: List of 3 key points you strongly agree with.
    5. divergent_points: List of 3 points where you offer a different nuance or disagreement.
    6. missed_citations: List of up to 3 important Bible citations (Book Chapter:Verse) that were missed, with text and relevance.
    7. cross_examination: A final synthesis statement comparing the perspectives.
  `;

  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    return JSON.parse(content) as PeerReview;
  } catch (error) {
    console.error("Mistral Review Failed:", error);
    return null;
  }
};
