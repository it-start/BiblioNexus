
import React, { useState, useEffect, useRef } from 'react';
import { CouncilSession, DebateTurn, AppLanguage, CouncilRole } from '../types';
import { Scroll, Shovel, Scale, Flame, Gavel, User } from 'lucide-react';

/**
 * Props for TheCouncil component.
 * @property session - The council session data to be displayed.
 * @property language - The language to be used for the component's text.
 */
interface TheCouncilProps {
  session: CouncilSession;
  language?: AppLanguage;
}

/**
 * A component that displays a simulated debate between three AI personas.
 *
 * @param session - The council session data to be displayed.
 * @param language - The language to be used for the component's text.
 * @returns A React component that renders the council debate.
 */
export const TheCouncil: React.FC<TheCouncilProps> = ({ session, language = AppLanguage.ENGLISH }) => {
  const [displayedTurns, setDisplayedTurns] = useState<DebateTurn[]>([]);
  const [showVerdict, setShowVerdict] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const t = {
    title: language === AppLanguage.RUSSIAN ? "Совет Трех (Синедрион)" : "The Council of Three",
    subtitle: language === AppLanguage.RUSSIAN ? "Синтез Мудрости: Дебаты в реальном времени" : "Synthetic Wisdom: Real-time Debate Protocol",
    verdict: language === AppLanguage.RUSSIAN ? "Вердикт Совета" : "The Council's Verdict",
    pending: language === AppLanguage.RUSSIAN ? "Остающиеся тайны" : "Remaining Mysteries",
    arch: language === AppLanguage.RUSSIAN ? "Археолог" : "The Archaeologist",
    theo: language === AppLanguage.RUSSIAN ? "Богослов" : "The Theologian",
    myst: language === AppLanguage.RUSSIAN ? "Мистик" : "The Mystic",
  };

  // Animate the debate turns appearing one by one
  useEffect(() => {
    if (!session || !session.debate_transcript) return;

    setDisplayedTurns([]);
    setShowVerdict(false);

    let currentTurn = 0;
    const interval = setInterval(() => {
      if (currentTurn < session.debate_transcript.length) {
        const turn = session.debate_transcript[currentTurn];
        if (turn) {
          setDisplayedTurns(prev => [...prev, turn]);
        }
        currentTurn++;
        // Auto scroll
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
        setTimeout(() => setShowVerdict(true), 800);
      }
    }, 2000); // 2 seconds per turn reading time

    return () => clearInterval(interval);
  }, [session]);

  const getPersonaIcon = (role: CouncilRole) => {
    switch (role) {
      case 'Archaeologist': return <Shovel size={20} />;
      case 'Theologian': return <Scale size={20} />;
      case 'Mystic': return <Flame size={20} />;
      default: return <User size={20} />;
    }
  };

  const getPersonaColor = (role: CouncilRole) => {
    switch (role) {
      case 'Archaeologist': return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'Theologian': return 'text-slate-800 bg-slate-200 border-slate-300';
      case 'Mystic': return 'text-purple-700 bg-purple-100 border-purple-200';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getPersonaName = (role: CouncilRole) => {
    switch (role) {
      case 'Archaeologist': return t.arch;
      case 'Theologian': return t.theo;
      case 'Mystic': return t.myst;
      default: return role;
    }
  };

  if (!session) return null;

  return (
    <div className="bg-[#1c1917] rounded-xl shadow-2xl border border-stone-800 overflow-hidden text-stone-200 font-serif">
      {/* Header */}
      <div className="bg-[#292524] p-6 border-b border-stone-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-stone-800 p-3 rounded-full text-amber-500 border border-amber-900/50 shadow-inner">
            <Gavel size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-amber-100/90 tracking-wide">{t.title}</h3>
            <p className="text-sm text-stone-500 italic">{t.subtitle}</p>
          </div>
        </div>
        <div className="hidden md:flex gap-2">
           {/* Avatars Status */}
           <div className={`w-3 h-3 rounded-full bg-amber-600 animate-pulse`}></div>
           <div className={`w-3 h-3 rounded-full bg-slate-400 animate-pulse delay-75`}></div>
           <div className={`w-3 h-3 rounded-full bg-purple-500 animate-pulse delay-150`}></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[500px]">
        
        {/* Debate Chamber */}
        <div className="lg:col-span-2 p-6 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] bg-stone-900 flex flex-col">
           <div ref={scrollRef} className="flex-1 space-y-6 overflow-y-auto max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent">
             {displayedTurns.map((turn, idx) => {
               if (!turn) return null;
               const isLeft = turn.speaker === 'Archaeologist';
               const isCenter = turn.speaker === 'Theologian';
               
               return (
                 <div key={idx} className={`flex ${isLeft ? 'justify-start' : isCenter ? 'justify-center' : 'justify-end'} animate-fade-in-up`}>
                   <div className={`max-w-[80%] rounded-xl p-4 border shadow-lg relative ${getPersonaColor(turn.speaker).replace('bg-', 'bg-opacity-10 bg-').replace('border-', 'border-opacity-30 border-')} bg-stone-800/80 backdrop-blur-sm`}>
                      
                      {/* Speaker Badge */}
                      <div className={`absolute -top-3 ${isLeft ? '-left-2' : '-right-2'} flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${getPersonaColor(turn.speaker)}`}>
                        {getPersonaIcon(turn.speaker)}
                        <span>{getPersonaName(turn.speaker)}</span>
                      </div>

                      <p className="mt-3 text-lg leading-relaxed text-stone-200">
                        "{turn.content}"
                      </p>
                   </div>
                 </div>
               );
             })}
             
             {/* Typing Indicator if not finished */}
             {!showVerdict && displayedTurns.length < session.debate_transcript.length && (
                <div className="flex justify-center py-4 opacity-50">
                  <span className="text-xs text-stone-500 tracking-widest uppercase animate-pulse">... Council is deliberating ...</span>
                </div>
             )}
           </div>
        </div>

        {/* Verdict Panel */}
        <div className="bg-[#292524] border-l border-stone-800 p-6 flex flex-col justify-center relative">
           {showVerdict ? (
             <div className="animate-scale-in space-y-6 text-center">
                <div className="mx-auto bg-amber-900/20 p-4 rounded-full w-20 h-20 flex items-center justify-center border border-amber-700/50 text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                   <Scroll size={40} />
                </div>
                
                <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-100 uppercase tracking-widest border-b border-stone-700 pb-4">
                  {t.verdict}
                </h4>

                <div className="bg-stone-900/50 p-6 rounded-lg border border-stone-700 text-left relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-600"></div>
                  <p className="text-stone-300 leading-loose italic text-lg">
                    "{session.verdict.agreement_statement}"
                  </p>
                </div>

                {session.verdict.pending_questions.length > 0 && (
                  <div className="text-left mt-8">
                     <h5 className="text-xs font-bold text-stone-500 uppercase mb-3 flex items-center gap-2">
                       <span className="w-2 h-2 bg-stone-600 rounded-full animate-ping"></span>
                       {t.pending}
                     </h5>
                     <ul className="space-y-2">
                       {session.verdict.pending_questions.map((q, i) => (
                         <li key={i} className="text-sm text-stone-400 pl-4 border-l border-stone-700">
                           {q}
                         </li>
                       ))}
                     </ul>
                  </div>
                )}
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-stone-600 gap-4">
               <div className="w-16 h-16 border-4 border-stone-700 border-t-amber-700 rounded-full animate-spin"></div>
               <p className="text-sm uppercase tracking-widest opacity-60">Awaiting Consensus</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};
