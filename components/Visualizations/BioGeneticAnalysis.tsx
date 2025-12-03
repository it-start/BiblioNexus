
import React, { useState } from 'react';
import { BioTheology, AppLanguage } from '../../types';
import { Dna, Activity, FlaskConical, Microscope } from 'lucide-react';

/**
 * Props for the BioGeneticAnalysis component.
 * @property data - The bio-theological data to be visualized.
 * @property language - The language to be used for the component's text.
 */
interface BioGeneticAnalysisProps {
  data: BioTheology;
  language?: AppLanguage;
}

/**
 * A component that visualizes bio-theological data using a DNA/RNA metaphor.
 *
 * @param data - The bio-theological data to be visualized.
 * @param language - The language to be used for the component's text.
 * @returns A React component that renders the bio-genetic analysis.
 */
export const BioGeneticAnalysis: React.FC<BioGeneticAnalysisProps> = ({ data, language = AppLanguage.ENGLISH }) => {
  const [selectedCodon, setSelectedCodon] = useState<number | null>(null);

  const t = {
    title: language === AppLanguage.RUSSIAN ? "Био-Теологический Секвенатор" : "Bio-Theological Sequencer",
    subtitle: language === AppLanguage.RUSSIAN ? "Геномная карта духовных атрибутов (ДНК/РНК метафора)" : "Genomic mapping of spiritual attributes (DNA/RNA metaphor)",
    sequence: language === AppLanguage.RUSSIAN ? "Генетическая последовательность" : "Genetic Sequence",
    translation: language === AppLanguage.RUSSIAN ? "Трансляция (Синтез белка)" : "Translation (Protein Synthesis)",
    summary: language === AppLanguage.RUSSIAN ? "Анализ генома" : "Genome Analysis",
    baseA: language === AppLanguage.RUSSIAN ? "A - Власть (От)" : "A - Authority (Father)",
    baseC: language === AppLanguage.RUSSIAN ? "C - Благодать (Сын)" : "C - Compassion (Son)",
    baseG: language === AppLanguage.RUSSIAN ? "G - Слава (Дух)" : "G - Glory (Spirit)",
    baseT: language === AppLanguage.RUSSIAN ? "T - Истина (Слово)" : "T - Truth (Word)",
    baseU: language === AppLanguage.RUSSIAN ? "U - Призыв (Действие)" : "U - Urgency (Action)",
  };

  if (!data || !data.sequence_data) return null;

  const getBaseColor = (base: string) => {
    switch (base) {
      case 'A': return 'bg-green-500 text-white border-green-600';
      case 'C': return 'bg-blue-500 text-white border-blue-600';
      case 'G': return 'bg-yellow-400 text-yellow-900 border-yellow-500';
      case 'T': return 'bg-red-500 text-white border-red-600';
      case 'U': return 'bg-orange-500 text-white border-orange-600';
      default: return 'bg-gray-400 text-gray-800';
    }
  };

  const getBaseLabel = (base: string) => {
    switch (base) {
      case 'A': return t.baseA;
      case 'C': return t.baseC;
      case 'G': return t.baseG;
      case 'T': return t.baseT;
      case 'U': return t.baseU;
      default: return base;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="bg-emerald-50 p-6 border-b border-emerald-100 flex items-center gap-3">
        <div className="bg-emerald-200 p-2 rounded-lg text-emerald-800">
          <Dna size={24} />
        </div>
        <div>
          <h3 className="text-xl font-serif font-bold text-gray-900">{t.title}</h3>
          <p className="text-sm text-emerald-800/70">{t.subtitle}</p>
        </div>
      </div>

      <div className="p-6">
        
        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-6 text-xs font-mono justify-center bg-stone-50 p-3 rounded-lg border border-stone-100">
          {['A', 'C', 'G', 'T'].map(base => (
            <div key={base} className={`px-2 py-1 rounded border flex items-center gap-2 ${getBaseColor(base).replace('text-white', '').replace('text-yellow-900', '')} bg-opacity-20 text-gray-700`}>
              <span className={`w-2 h-2 rounded-full ${getBaseColor(base)}`}></span>
              {getBaseLabel(base)}
            </div>
          ))}
        </div>

        {/* Sequencer Visualization */}
        <div className="relative mb-8 overflow-x-auto pb-4">
          <div className="flex items-center gap-1 min-w-max px-4">
            {/* Double Helix Backbone Top */}
            
            {data.sequence_data.map((base, idx) => {
               const codonIdx = Math.floor(idx / 3);
               const isSelected = selectedCodon === codonIdx;
               
               return (
                <div 
                  key={idx} 
                  className={`relative group flex flex-col items-center gap-2 transition-all duration-300 ${isSelected ? 'scale-110 z-10' : 'opacity-80 hover:opacity-100'}`}
                  onMouseEnter={() => setSelectedCodon(codonIdx)}
                  onMouseLeave={() => setSelectedCodon(null)}
                >
                  {/* Top Strand Connection */}
                  <div className="w-px h-4 bg-gray-300"></div>

                  {/* Nucleotide Base */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-lg shadow-sm border-b-4 cursor-pointer ${getBaseColor(base.nucleotide)}`}>
                    {base.nucleotide}
                  </div>

                  {/* Hydrogen Bond / Bottom Strand */}
                  <div className="w-px h-4 bg-gray-300"></div>
                  
                  {/* Tooltip for specific base */}
                  <div className="absolute top-full mt-2 w-32 bg-gray-900 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-20 transition-opacity">
                    <div className="font-bold mb-1">{base.concept}</div>
                    <div className="italic text-gray-400">"{base.snippet}"</div>
                  </div>
                </div>
               );
            })}
          </div>

          {/* DNA Strand Lines (Decorative) */}
          <div className="absolute top-[26px] left-0 right-0 h-px bg-gray-200 -z-10"></div>
          <div className="absolute top-[76px] left-0 right-0 h-px bg-gray-200 -z-10"></div>
        </div>

        {/* Translation / Protein Synthesis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Codon Analysis */}
          <div className="bg-stone-50 rounded-xl p-5 border border-stone-200">
             <div className="flex items-center gap-2 mb-4 text-emerald-800">
               <Microscope size={18} />
               <h4 className="font-bold text-sm uppercase tracking-wide">{t.translation}</h4>
             </div>
             
             <div className="space-y-4">
               {data.codons.map((codon, idx) => (
                 <div 
                   key={idx} 
                   className={`p-3 rounded-lg border transition-all duration-300 flex gap-4 ${
                     selectedCodon === idx || selectedCodon === null
                      ? 'bg-white border-stone-200 shadow-sm' 
                      : 'opacity-40 bg-transparent border-transparent'
                   }`}
                   onMouseEnter={() => setSelectedCodon(idx)}
                   onMouseLeave={() => setSelectedCodon(null)}
                 >
                   <div className="flex flex-col items-center justify-center w-12 shrink-0">
                      <span className="font-mono font-bold text-xs text-gray-400">CODON</span>
                      <span className="font-mono text-lg font-bold text-indigo-600 tracking-widest">{codon.sequence}</span>
                   </div>
                   
                   <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                        <Activity size={14} className="text-pink-500" />
                        <span className="font-serif font-bold text-gray-800">{codon.amino_acid}</span>
                     </div>
                     <p className="text-xs text-gray-600 leading-relaxed">
                       {codon.description}
                     </p>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Genomic Summary */}
          <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100">
             <div className="flex items-center gap-2 mb-4 text-indigo-800">
               <FlaskConical size={18} />
               <h4 className="font-bold text-sm uppercase tracking-wide">{t.summary}</h4>
             </div>
             <p className="text-sm text-indigo-900/80 leading-loose font-serif">
               {data.summary}
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};
