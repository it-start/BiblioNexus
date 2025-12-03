import React, { useState, useMemo } from 'react';
import { CrossReference, AppLanguage } from '../../types';
import { GitMerge, Code, ArrowRight, Dna } from 'lucide-react';

/**
 * Props for the ScriptureDNA component.
 * @property references - An array of cross-references to be visualized.
 * @property language - The language to be used for the component's text.
 */
interface ScriptureDNAProps {
  references: CrossReference[];
  language?: AppLanguage;
}

/**
 * A component that visualizes the "DNA" of scripture by showing shared words and phrases between cross-references.
 *
 * @param references - An array of cross-references to be visualized.
 * @param language - The language to be used for the component's text.
 * @returns A React component that renders the scripture DNA analysis.
 */
export const ScriptureDNA: React.FC<ScriptureDNAProps> = ({ references, language = AppLanguage.ENGLISH }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const t = {
    title: language === AppLanguage.RUSSIAN ? "Библейский код (ДНК)" : "Scriptural DNA",
    subtitle: language === AppLanguage.RUSSIAN ? "Исследование генетических связей текста" : "Exploring text-genetic connections",
    compare: language === AppLanguage.RUSSIAN ? "Сравнение текста" : "Text Comparison",
    shared: language === AppLanguage.RUSSIAN ? "Общие корни/слова" : "Shared Roots/Words",
    clickPrompt: language === AppLanguage.RUSSIAN ? "Нажмите на пару для анализа" : "Click pair to analyze"
  };

  // Helper to color code relationship types
  const getBorderColor = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes('prophecy')) return 'border-blue-400';
    if (lower.includes('fulfillment')) return 'border-blue-500';
    if (lower.includes('contrast')) return 'border-red-400';
    if (lower.includes('quote')) return 'border-green-400';
    if (lower.includes('typology')) return 'border-purple-400';
    return 'border-indigo-300';
  };

  const getBadgeColor = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes('prophecy')) return 'bg-blue-100 text-blue-800';
    if (lower.includes('fulfillment')) return 'bg-blue-100 text-blue-800';
    if (lower.includes('contrast')) return 'bg-red-100 text-red-800';
    if (lower.includes('quote')) return 'bg-green-100 text-green-800';
    if (lower.includes('typology')) return 'bg-purple-100 text-purple-800';
    return 'bg-indigo-100 text-indigo-800';
  };

  // Diff Logic: Find shared words between two strings
  const getDiffedText = (text1: string, text2: string) => {
    if (!text1 || !text2) return { t1: text1, t2: text2 };

    const normalize = (s: string) => s.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
    
    // Tokenize
    const tokens1 = text1.split(/\s+/);
    const tokens2 = text2.split(/\s+/);
    
    // Create Set of normalized tokens from text2 for fast lookup
    const set2 = new Set(tokens2.map(normalize));
    const set1 = new Set(tokens1.map(normalize));

    // Render Function
    const renderTokens = (tokens: string[], comparisonSet: Set<string>) => {
      return tokens.map((token, i) => {
        const clean = normalize(token);
        // Basic match (len > 3 to avoid 'the', 'and', 'in' noise)
        const isMatch = comparisonSet.has(clean) && clean.length > 2;
        
        return (
          <span 
            key={i} 
            className={`inline-block transition-all duration-300 ${isMatch ? 'bg-amber-200 text-amber-900 font-bold px-1 rounded mx-0.5 transform scale-105' : 'text-gray-600'}`}
          >
            {token}{' '}
          </span>
        );
      });
    };

    return {
      rendered1: renderTokens(tokens1, set2),
      rendered2: renderTokens(tokens2, set1)
    };
  };

  if (!references || references.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="bg-stone-50 p-6 border-b border-stone-200 flex items-center gap-3">
        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-700">
          <Dna size={24} />
        </div>
        <div>
          <h3 className="text-xl font-serif font-bold text-gray-900">{t.title}</h3>
          <p className="text-sm text-gray-500">{t.subtitle}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {references.map((ref, idx) => {
            const isActive = activeIndex === idx;
            const diff = isActive ? getDiffedText(ref.primary_text, ref.related_text) : null;
            
            return (
              <div 
                key={idx} 
                className={`group relative rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                  isActive ? 'border-indigo-500 shadow-md bg-white' : 'border-stone-100 hover:border-indigo-200 bg-stone-50'
                }`}
                onClick={() => setActiveIndex(isActive ? null : idx)}
              >
                {/* Visual Connector (The "Helix Rung") */}
                <div className={`absolute left-0 top-0 bottom-0 w-2 transition-colors ${getBadgeColor(ref.connection_type).replace('text', 'bg').split(' ')[0]}`} />

                <div className="p-4 pl-6">
                  {/* Top Row: References & Type */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <span className="font-serif font-bold text-lg text-gray-800">{ref.primary_verse}</span>
                      <ArrowRight size={16} className="text-gray-400" />
                      <span className="font-serif font-bold text-lg text-gray-800">{ref.related_verse}</span>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getBadgeColor(ref.connection_type)}`}>
                      {ref.connection_type}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 italic mb-2">
                    {ref.description}
                  </p>

                  {/* Expanded View: "Code Diff" */}
                  <div className={`grid transition-all duration-500 ease-in-out overflow-hidden ${isActive ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="min-h-0">
                      <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 font-mono text-sm">
                        <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs uppercase tracking-widest font-bold">
                           <Code size={14} /> {t.compare}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                           {/* Primary Text */}
                           <div>
                             <div className="text-xs text-slate-400 mb-1">{ref.primary_verse}</div>
                             <div className="leading-relaxed">
                               {diff?.rendered1}
                             </div>
                           </div>
                           
                           {/* Divider */}
                           <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -ml-px"></div>

                           {/* Related Text */}
                           <div>
                             <div className="text-xs text-slate-400 mb-1">{ref.related_verse}</div>
                             <div className="leading-relaxed">
                               {diff?.rendered2}
                             </div>
                           </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-200 text-[10px] text-slate-400 flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-amber-200 rounded-sm"></span>
                          {t.shared}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hint */}
                  {!isActive && (
                    <div className="mt-2 text-[10px] text-gray-400 text-right uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                      {t.clickPrompt}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};