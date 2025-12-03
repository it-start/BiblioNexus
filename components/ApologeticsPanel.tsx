
import React from 'react';
import { ApologeticsData, AppLanguage } from '../types';
import { Shield, Radio, MessageCircleQuestion, Zap, BookCheck } from 'lucide-react';

/**
 * Props for the ApologeticsPanel component.
 * @property data - The apologetics data to be displayed.
 * @property language - The language to be used for the component's text.
 */
interface ApologeticsPanelProps {
  data: ApologeticsData;
  language?: AppLanguage;
}

/**
 * A component that displays apologetics data, including cultural context, hard questions, and an ethical imperative.
 *
 * @param data - The apologetics data to be displayed.
 * @param language - The language to be used for the component's text.
 * @returns A React component that renders the apologetics panel.
 */
export const ApologeticsPanel: React.FC<ApologeticsPanelProps> = ({ data, language = AppLanguage.ENGLISH }) => {
  const t = {
    title: language === AppLanguage.RUSSIAN ? "Апологетика и Культура" : "Apologetics & Culture",
    subtitle: language === AppLanguage.RUSSIAN ? "Защита веры в современную эпоху (Command R+)" : "Defending the faith in the modern era (Command R+)",
    zeitgeist: language === AppLanguage.RUSSIAN ? "Культурный дух времени" : "Cultural Zeitgeist",
    skeptic: language === AppLanguage.RUSSIAN ? "Уголок скептика" : "Skeptic's Corner",
    imperative: language === AppLanguage.RUSSIAN ? "Этический императив" : "Ethical Imperative",
    defense: language === AppLanguage.RUSSIAN ? "Библейская защита:" : "Biblical Defense:",
  };

  if (!data) return null;

  // Helper to safely render content that might be passed as an object due to LLM hallucinations
  const safeRender = (content: any) => {
    if (typeof content === 'string') return content;
    if (typeof content === 'object' && content !== null) {
      return Object.values(content).join(' ');
    }
    return '';
  };

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-fade-in-up my-8">
      {/* Header */}
      <div className="bg-[#2c3e50] p-6 border-b border-slate-600 flex items-center gap-3">
        <div className="bg-orange-500 p-2 rounded-lg text-white shadow-lg shadow-orange-500/20">
          <Shield size={24} />
        </div>
        <div>
          <h3 className="text-xl font-serif font-bold text-white">{t.title}</h3>
          <p className="text-sm text-slate-300 font-light">{t.subtitle}</p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Cultural Context */}
        <div className="bg-white p-6 rounded-xl border-l-4 border-purple-500 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-purple-700">
            <Radio size={20} />
            <h4 className="font-bold text-sm uppercase tracking-wider">{t.zeitgeist}</h4>
          </div>
          <p className="text-gray-700 leading-relaxed font-serif text-lg">
            {safeRender(data.cultural_context)}
          </p>
        </div>

        {/* Ethical Imperative */}
        <div className="bg-white p-6 rounded-xl border-l-4 border-emerald-500 shadow-sm">
           <div className="flex items-center gap-2 mb-4 text-emerald-700">
            <Zap size={20} />
            <h4 className="font-bold text-sm uppercase tracking-wider">{t.imperative}</h4>
          </div>
           <p className="text-gray-700 leading-relaxed font-serif text-lg italic">
            "{safeRender(data.ethical_imperative)}"
          </p>
        </div>

        {/* Hard Questions (Full Width) */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4 text-orange-700 pl-2">
             <MessageCircleQuestion size={24} />
             <h4 className="font-bold text-lg font-serif">{t.skeptic}</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.hard_questions.map((q, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-stone-100 p-4 border-b border-stone-200">
                  <h5 className="font-bold text-stone-800 text-sm leading-snug">
                    <span className="text-orange-500 mr-2">Obj:</span> 
                    {safeRender(q.claim)}
                  </h5>
                </div>
                <div className="p-4">
                  <p className="text-stone-600 text-sm mb-4 leading-relaxed">
                    {safeRender(q.rebuttal)}
                  </p>
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 text-xs">
                     <div className="font-bold text-orange-800 mb-1 flex items-center gap-1">
                       <BookCheck size={12} /> {t.defense}
                     </div>
                     <p className="text-orange-900/80 italic">
                       {safeRender(q.scripture_defense)}
                     </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
