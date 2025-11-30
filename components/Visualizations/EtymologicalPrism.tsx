
import React, { useState } from 'react';
import { EtymologyAnalysis, AppLanguage } from '../../types';
import { Sparkles, BookOpen, Search, Languages } from 'lucide-react';

interface EtymologicalPrismProps {
  data: EtymologyAnalysis;
  language?: AppLanguage;
}

export const EtymologicalPrism: React.FC<EtymologicalPrismProps> = ({ data, language = AppLanguage.ENGLISH }) => {
  const [hoveredRoot, setHoveredRoot] = useState<number | null>(null);

  const t = {
    title: language === AppLanguage.RUSSIAN ? "Этимологическая спектрометрия" : "Etymological Spectrometry",
    subtitle: language === AppLanguage.RUSSIAN ? "Анализ исходного кода (Иврит/Греческий)" : "Source Code Analysis (Hebrew/Greek)",
    synthesis: language === AppLanguage.RUSSIAN ? "Синтез смысла" : "Meaning Synthesis",
    occurrences: language === AppLanguage.RUSSIAN ? "встречается" : "occurrences",
    language: language === AppLanguage.RUSSIAN ? "Язык" : "Language",
    context: language === AppLanguage.RUSSIAN ? "Контекст" : "Context",
  };

  if (!data || !data.roots) return null;

  // Visualization Layout Constants
  const width = 600;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;
  const centerRadius = 50;
  const orbitRadius = 140;

  // Distribute roots in a semi-circle or full circle depending on count
  const angleStep = (2 * Math.PI) / data.roots.length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
          <Languages size={24} />
        </div>
        <div>
          <h3 className="text-xl font-serif font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            {t.title}
          </h3>
          <p className="text-sm text-slate-400 font-light">{t.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        
        {/* The Prism Visualization */}
        <div className="lg:col-span-2 bg-[#0f172a] relative overflow-hidden flex items-center justify-center p-6 min-h-[400px]">
          {/* Background Ambient Light */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full max-w-[600px] drop-shadow-2xl">
            <defs>
              <filter id="glow-text" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="beam-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Connecting Rays */}
            {data.roots.map((root, i) => {
              const angle = i * angleStep - Math.PI / 2; // Start from top
              const x = centerX + orbitRadius * Math.cos(angle);
              const y = centerY + orbitRadius * Math.sin(angle);
              const isHovered = hoveredRoot === i;

              return (
                <g key={`ray-${i}`}>
                   <line 
                     x1={centerX} 
                     y1={centerY} 
                     x2={x} 
                     y2={y} 
                     stroke={isHovered ? "url(#beam-grad)" : "#334155"} 
                     strokeWidth={isHovered ? 4 : 1}
                     opacity={isHovered ? 1 : 0.4}
                     className="transition-all duration-300"
                   />
                </g>
              );
            })}

            {/* Central Node (Target Word) */}
            <g className="cursor-default">
              <circle cx={centerX} cy={centerY} r={centerRadius + 5} fill="#1e293b" stroke="#475569" strokeWidth="1" />
              <circle cx={centerX} cy={centerY} r={centerRadius} fill="#f8fafc" />
              <text 
                x={centerX} 
                y={centerY} 
                dy=".3em" 
                textAnchor="middle" 
                className="font-serif font-bold text-slate-900 text-lg uppercase tracking-wider"
              >
                {data.target_word}
              </text>
            </g>

            {/* Root Nodes (Isotopes) */}
            {data.roots.map((root, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const x = centerX + orbitRadius * Math.cos(angle);
              const y = centerY + orbitRadius * Math.sin(angle);
              const isHovered = hoveredRoot === i;

              // Color based on language
              const nodeColor = root.language === 'Hebrew' ? '#fbbf24' : (root.language === 'Greek' ? '#38bdf8' : '#a78bfa');
              const nodeLabel = root.language === 'Hebrew' ? 'Heb' : (root.language === 'Greek' ? 'Grk' : 'Arm');

              return (
                <g 
                  key={`node-${i}`} 
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredRoot(i)}
                  onMouseLeave={() => setHoveredRoot(null)}
                >
                  {/* Hover Glow */}
                  <circle 
                    cx={x} 
                    cy={y} 
                    r={isHovered ? 45 : 35} 
                    fill={nodeColor} 
                    opacity={isHovered ? 0.2 : 0} 
                    className="transition-all duration-300"
                  />
                  
                  {/* Node Body */}
                  <circle 
                    cx={x} 
                    cy={y} 
                    r={30} 
                    fill="#0f172a" 
                    stroke={nodeColor} 
                    strokeWidth={isHovered ? 3 : 2} 
                  />
                  
                  {/* Original Word */}
                  <text 
                    x={x} 
                    y={y} 
                    dy="-0.2em" 
                    textAnchor="middle" 
                    fill={nodeColor} 
                    className="font-serif font-bold text-sm"
                    style={{ textShadow: isHovered ? `0 0 10px ${nodeColor}` : 'none' }}
                  >
                    {root.original_word}
                  </text>
                  
                  {/* Transliteration */}
                  <text 
                    x={x} 
                    y={y} 
                    dy="1.2em" 
                    textAnchor="middle" 
                    fill="#94a3b8" 
                    fontSize="10" 
                    className="font-mono tracking-tighter"
                  >
                    {root.transliteration}
                  </text>

                  {/* Language Badge */}
                  <rect 
                    x={x - 14} 
                    y={y + 35} 
                    width="28" 
                    height="14" 
                    rx="4" 
                    fill={nodeColor} 
                  />
                  <text 
                    x={x} 
                    y={y + 45} 
                    textAnchor="middle" 
                    fill="#0f172a" 
                    fontSize="9" 
                    fontWeight="bold"
                  >
                    {nodeLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Details Panel */}
        <div className="bg-slate-50 p-6 flex flex-col h-full border-l border-stone-200">
           {hoveredRoot !== null ? (
             <div className="animate-fade-in">
               <div className="flex items-center gap-2 mb-2">
                 <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${data.roots[hoveredRoot].language === 'Hebrew' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}`}>
                   {data.roots[hoveredRoot].language}
                 </span>
                 <span className="text-slate-400 text-xs font-mono">{data.roots[hoveredRoot].usage_count} {t.occurrences}</span>
               </div>
               
               <h2 className="text-3xl font-serif font-bold text-slate-800 mb-1">
                 {data.roots[hoveredRoot].transliteration}
               </h2>
               <div className="text-2xl font-serif text-slate-400 mb-4 font-light">
                 {data.roots[hoveredRoot].original_word}
               </div>

               <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-100 mb-4">
                 <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                   <BookOpen size={12} /> Definition
                 </h4>
                 <p className="text-slate-700 leading-relaxed font-serif text-lg">
                   {data.roots[hoveredRoot].meaning}
                 </p>
               </div>

               <div>
                 <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                   <Search size={12} /> {t.context}
                 </h4>
                 <p className="text-sm text-slate-600 italic leading-relaxed">
                   "{data.roots[hoveredRoot].usage_context}"
                 </p>
               </div>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400">
               <Sparkles size={48} className="mb-4 opacity-20" />
               <p className="text-sm">{t.synthesis}</p>
               <p className="text-slate-600 mt-4 leading-relaxed font-serif italic border-l-2 border-indigo-200 pl-4 text-left">
                 "{data.synthesis}"
               </p>
               <div className="mt-8 text-xs bg-slate-200/50 px-3 py-1 rounded-full">
                 Hover over a node to inspect isotopes
               </div>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};
