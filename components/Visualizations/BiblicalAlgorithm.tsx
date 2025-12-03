import React from 'react';
import { AlgorithmicAnalysis, AppLanguage } from '../../types';
import { Terminal, Cpu, Box, Lock, RefreshCw, GitBranch, ArrowRight } from 'lucide-react';

/**
 * Props for the BiblicalAlgorithm component.
 * @property data - The algorithmic analysis data to be visualized.
 * @property language - The language to be used for the component's text.
 */
interface BiblicalAlgorithmProps {
  data: AlgorithmicAnalysis;
  language?: AppLanguage;
}

/**
 * A component that visualizes theological logic as source code.
 *
 * @param data - The algorithmic analysis data to be visualized.
 * @param language - The language to be used for the component's text.
 * @returns A React component that renders the algorithmic analysis.
 */
export const BiblicalAlgorithm: React.FC<BiblicalAlgorithmProps> = ({ data, language = AppLanguage.ENGLISH }) => {
  const t = {
    title: language === AppLanguage.RUSSIAN ? "Божественный алгоритм (Bible as Code)" : "Divine Algorithm (Bible as Code)",
    subtitle: language === AppLanguage.RUSSIAN ? "Визуализация богословской логики как исходного кода" : "Visualizing theological logic as source code",
    variables: language === AppLanguage.RUSSIAN ? "Переменные среды" : "Environment Variables",
    logic: language === AppLanguage.RUSSIAN ? "Поток исполнения" : "Execution Flow",
    const: language === AppLanguage.RUSSIAN ? "КОНСТАНТА" : "CONST",
    mutable: language === AppLanguage.RUSSIAN ? "ПЕРЕМЕННАЯ" : "MUTABLE",
    global: language === AppLanguage.RUSSIAN ? "ГЛОБАЛЬНАЯ" : "GLOBAL",
  };

  if (!data || !data.variables || !data.logic_flow) return null;

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'constant': return 'text-purple-400';
      case 'mutable': return 'text-yellow-400';
      case 'global': return 'text-green-400';
      default: return 'text-blue-400';
    }
  };

  const getFlowIcon = (type: string) => {
    switch(type) {
      case 'loop': return <RefreshCw size={14} className="text-orange-400" />;
      case 'condition': return <GitBranch size={14} className="text-blue-400" />;
      case 'assignment': return <ArrowRight size={14} className="text-green-400" />;
      default: return <Terminal size={14} className="text-gray-400" />;
    }
  };

  const getIndent = (level: number) => {
    return { paddingLeft: `${level * 24}px` };
  };

  return (
    <div className="bg-[#1e1e1e] rounded-xl shadow-lg border border-stone-800 overflow-hidden text-gray-300 font-mono text-sm">
      {/* Header (IDE Style) */}
      <div className="bg-[#2d2d2d] px-4 py-3 border-b border-black/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cpu className="text-indigo-400" size={18} />
          <div>
             <h3 className="font-bold text-gray-200 text-sm tracking-wide">{t.title}</h3>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-stone-700/50">
        
        {/* Variables Panel */}
        <div className="p-0 bg-[#252526]">
          <div className="px-4 py-2 bg-[#1e1e1e] text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-stone-800 flex items-center gap-2">
            <Box size={12} /> {t.variables}
          </div>
          <div className="p-4 space-y-4">
            {data.variables.map((v, idx) => (
              <div key={idx} className="group">
                <div className="flex items-center gap-2 mb-1">
                   {v.type === 'constant' ? <Lock size={12} className="text-purple-400" /> : <Box size={12} className="text-yellow-400" />}
                   <span className={`${getTypeColor(v.type)} font-bold`}>{v.name}</span>
                   <span className="text-gray-500">=</span>
                   <span className="text-orange-300">"{v.value}"</span>
                </div>
                <div className="text-[10px] text-gray-500 pl-5 border-l border-gray-700 ml-1.5 group-hover:text-gray-400 transition-colors">
                  <span className="text-xs font-bold text-gray-600 mr-1">
                    {v.type === 'constant' ? t.const : v.type === 'global' ? t.global : t.mutable}
                  </span>
                  // {v.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logic Flow Panel */}
        <div className="lg:col-span-2 p-0 bg-[#1e1e1e]">
          <div className="px-4 py-2 bg-[#1e1e1e] text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-stone-800 flex items-center gap-2">
             <Terminal size={12} /> {t.logic}
          </div>
          <div className="p-4 overflow-x-auto">
             <div className="space-y-1">
               {data.logic_flow.map((step, idx) => (
                 <div key={idx} className="flex items-start group hover:bg-[#2a2a2a] p-1 rounded -mx-2 px-2 transition-colors">
                   {/* Line Number */}
                   <div className="text-gray-600 select-none w-8 text-right mr-4 text-xs pt-1">{idx + 1}</div>
                   
                   <div className="flex-1" style={getIndent(step.indent_level)}>
                      <div className="flex items-center gap-2">
                         {/* Code Syntax Highlighting Simulation */}
                         <div className="font-mono text-gray-300">
                           {step.code.split(' ').map((word, wIdx) => {
                             if (['if', 'else', 'while', 'for', 'return'].includes(word)) return <span key={wIdx} className="text-pink-400 font-bold">{word} </span>;
                             if (['true', 'false', 'null'].includes(word)) return <span key={wIdx} className="text-blue-400 font-bold">{word} </span>;
                             if (word.includes('(') || word.includes(')')) return <span key={wIdx} className="text-yellow-200">{word} </span>;
                             if (word.includes('{') || word.includes('}')) return <span key={wIdx} className="text-yellow-400">{word} </span>;
                             return <span key={wIdx}>{word} </span>;
                           })}
                         </div>
                      </div>
                      {/* Comments / Explanation */}
                      <div className="text-green-600/60 text-xs mt-0.5 italic flex items-center gap-1">
                        // {step.explanation}
                      </div>
                   </div>
                 </div>
               ))}
             </div>
             
             {/* Blinking Cursor */}
             <div className="flex items-center mt-2 pl-12">
               <div className="w-2 h-4 bg-gray-500 animate-pulse"></div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};