
import React from 'react';
import { PeerReview, AppLanguage } from '../types';
import { ShieldCheck, AlertTriangle, CheckCircle2, PlusCircle, Scale, BrainCircuit } from 'lucide-react';

/**
 * Props for the PeerReviewPanel component.
 * @property review - The peer review data to be displayed.
 * @property language - The language to be used for the component's text.
 */
interface PeerReviewPanelProps {
  review: PeerReview;
  language?: AppLanguage;
}

/**
 * A component that displays the results of a peer review.
 *
 * @param review - The peer review data to be displayed.
 * @param language - The language to be used for the component's text.
 * @returns A React component that renders the peer review panel.
 */
export const PeerReviewPanel: React.FC<PeerReviewPanelProps> = ({ review, language = AppLanguage.ENGLISH }) => {
  const t = {
    title: language === AppLanguage.RUSSIAN ? "Совет ИИ: Рецензия (Поиск истины)" : "AI Council: Peer Review (Truth Finding)",
    score: language === AppLanguage.RUSSIAN ? "Оценка верности" : "Fidelity Score",
    consensus: language === AppLanguage.RUSSIAN ? "Консенсус (Согласие)" : "Consensus Points",
    divergence: language === AppLanguage.RUSSIAN ? "Нюансы / Расхождения" : "Nuance & Divergence",
    missed: language === AppLanguage.RUSSIAN ? "Упущенные ссылки" : "Missed References",
    synthesis: language === AppLanguage.RUSSIAN ? "Синтез" : "Synthesis",
    reviewer: language === AppLanguage.RUSSIAN ? "Рецензент" : "Reviewer",
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 75) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-fade-in-up">
      {/* Header */}
      <div className="bg-slate-100 p-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-lg">
            <Scale size={20} />
          </div>
          <div>
            <h3 className="font-serif font-bold text-slate-800 text-lg">{t.title}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <BrainCircuit size={12} />
              <span>{t.reviewer}: {review.reviewer_name}</span>
            </div>
          </div>
        </div>

        <div className={`px-4 py-2 rounded-lg border flex items-center gap-3 ${getScoreColor(review.agreement_score)}`}>
          <ShieldCheck size={20} />
          <div>
            <div className="text-xs uppercase font-bold tracking-wider opacity-80">{t.score}</div>
            <div className="text-2xl font-bold leading-none">{review.agreement_score}%</div>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Consensus Column */}
        <div>
          <h4 className="flex items-center gap-2 font-bold text-emerald-700 mb-4 pb-2 border-b border-emerald-100">
            <CheckCircle2 size={18} /> {t.consensus}
          </h4>
          <ul className="space-y-3">
            {review.consensus_points.map((point, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-slate-700">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Divergence Column */}
        <div>
          <h4 className="flex items-center gap-2 font-bold text-amber-700 mb-4 pb-2 border-b border-amber-100">
            <AlertTriangle size={18} /> {t.divergence}
          </h4>
          <ul className="space-y-3">
            {review.divergent_points.map((point, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-slate-700">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Missed Citations */}
        <div className="md:col-span-2">
           <h4 className="flex items-center gap-2 font-bold text-indigo-700 mb-4 pb-2 border-b border-indigo-100">
            <PlusCircle size={18} /> {t.missed}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {review.missed_citations.map((cite, idx) => (
              <div key={idx} className="bg-white p-3 rounded border border-slate-200 text-sm">
                <div className="font-bold text-indigo-900 font-serif mb-1">
                  {cite.book} {cite.chapter}:{cite.verse_start}
                </div>
                <div className="text-slate-600 italic mb-2">"{cite.text}"</div>
                <div className="text-xs text-slate-400 uppercase tracking-wide font-bold">{cite.relevance}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Synthesis */}
        <div className="md:col-span-2 bg-slate-200/50 p-4 rounded-lg border border-slate-200">
          <h4 className="font-bold text-slate-700 mb-2 text-sm uppercase tracking-wide">{t.synthesis}</h4>
          <p className="text-slate-800 italic leading-relaxed font-serif">
            "{review.cross_examination}"
          </p>
        </div>

      </div>
    </div>
  );
};
