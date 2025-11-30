import React, { useMemo, useState } from 'react';
import { CrossReference, AppLanguage } from '../../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface PropheticArcsProps {
  data: CrossReference[];
  language?: AppLanguage;
}

// Canonical order of Bible books for mapping
const BIBLE_BOOKS = [
  // Old Testament
  { en: "Genesis", ru: "Бытие", div: "Pentateuch" },
  { en: "Exodus", ru: "Исход", div: "Pentateuch" },
  { en: "Leviticus", ru: "Левит", div: "Pentateuch" },
  { en: "Numbers", ru: "Числа", div: "Pentateuch" },
  { en: "Deuteronomy", ru: "Второзаконие", div: "Pentateuch" },
  { en: "Joshua", ru: "Иисус Навин", div: "History" },
  { en: "Judges", ru: "Судьи", div: "History" },
  { en: "Ruth", ru: "Руфь", div: "History" },
  { en: "1 Samuel", ru: "1 Царств", div: "History" },
  { en: "2 Samuel", ru: "2 Царств", div: "History" },
  { en: "1 Kings", ru: "3 Царств", div: "History" },
  { en: "2 Kings", ru: "4 Царств", div: "History" },
  { en: "1 Chronicles", ru: "1 Паралипоменон", div: "History" },
  { en: "2 Chronicles", ru: "2 Паралипоменон", div: "History" },
  { en: "Ezra", ru: "Ездра", div: "History" },
  { en: "Nehemiah", ru: "Неемия", div: "History" },
  { en: "Esther", ru: "Есфирь", div: "History" },
  { en: "Job", ru: "Иов", div: "Poetry" },
  { en: "Psalms", ru: "Псалтирь", div: "Poetry" },
  { en: "Proverbs", ru: "Притчи", div: "Poetry" },
  { en: "Ecclesiastes", ru: "Екклесиаст", div: "Poetry" },
  { en: "Song of Solomon", ru: "Песня Песней", div: "Poetry" },
  { en: "Isaiah", ru: "Исаия", div: "Prophets" },
  { en: "Jeremiah", ru: "Иеремия", div: "Prophets" },
  { en: "Lamentations", ru: "Плач Иеремии", div: "Prophets" },
  { en: "Ezekiel", ru: "Иезекииль", div: "Prophets" },
  { en: "Daniel", ru: "Даниил", div: "Prophets" },
  { en: "Hosea", ru: "Осия", div: "Prophets" },
  { en: "Joel", ru: "Иоиль", div: "Prophets" },
  { en: "Amos", ru: "Амос", div: "Prophets" },
  { en: "Obadiah", ru: "Авдий", div: "Prophets" },
  { en: "Jonah", ru: "Иона", div: "Prophets" },
  { en: "Micah", ru: "Михей", div: "Prophets" },
  { en: "Nahum", ru: "Наум", div: "Prophets" },
  { en: "Habakkuk", ru: "Аввакум", div: "Prophets" },
  { en: "Zephaniah", ru: "Софония", div: "Prophets" },
  { en: "Haggai", ru: "Аггей", div: "Prophets" },
  { en: "Zechariah", ru: "Захария", div: "Prophets" },
  { en: "Malachi", ru: "Малахия", div: "Prophets" },
  // New Testament
  { en: "Matthew", ru: "От Матфея", div: "Gospels" },
  { en: "Mark", ru: "От Марка", div: "Gospels" },
  { en: "Luke", ru: "От Луки", div: "Gospels" },
  { en: "John", ru: "От Иоанна", div: "Gospels" },
  { en: "Acts", ru: "Деяния", div: "History" },
  { en: "Romans", ru: "Римлянам", div: "Epistles" },
  { en: "1 Corinthians", ru: "1 Коринфянам", div: "Epistles" },
  { en: "2 Corinthians", ru: "2 Коринфянам", div: "Epistles" },
  { en: "Galatians", ru: "Галатам", div: "Epistles" },
  { en: "Ephesians", ru: "Ефесянам", div: "Epistles" },
  { en: "Philippians", ru: "Филиппийцам", div: "Epistles" },
  { en: "Colossians", ru: "Колоссянам", div: "Epistles" },
  { en: "1 Thessalonians", ru: "1 Фессалоникийцам", div: "Epistles" },
  { en: "2 Thessalonians", ru: "2 Фессалоникийцам", div: "Epistles" },
  { en: "1 Timothy", ru: "1 Тимофею", div: "Epistles" },
  { en: "2 Timothy", ru: "2 Тимофею", div: "Epistles" },
  { en: "Titus", ru: "Титу", div: "Epistles" },
  { en: "Philemon", ru: "Филимону", div: "Epistles" },
  { en: "Hebrews", ru: "Евреям", div: "Epistles" },
  { en: "James", ru: "Иакова", div: "Epistles" },
  { en: "1 Peter", ru: "1 Петра", div: "Epistles" },
  { en: "2 Peter", ru: "2 Петра", div: "Epistles" },
  { en: "1 John", ru: "1 Иоанна", div: "Epistles" },
  { en: "2 John", ru: "2 Иоанна", div: "Epistles" },
  { en: "3 John", ru: "3 Иоанна", div: "Epistles" },
  { en: "Jude", ru: "Иуды", div: "Epistles" },
  { en: "Revelation", ru: "Откровение", div: "Prophecy" }
];

export const PropheticArcs: React.FC<PropheticArcsProps> = ({ data, language = AppLanguage.ENGLISH }) => {
  const [hoveredArc, setHoveredArc] = useState<number | null>(null);

  const t = {
    title: language === AppLanguage.RUSSIAN ? "Пророческая траектория" : "Prophetic Trajectory",
    subtitle: language === AppLanguage.RUSSIAN ? "Божественные дуги от обетования к исполнению" : "Divine arcs from promise to fulfillment",
    ot: "OT",
    nt: "NT"
  };

  const getBookIndex = (ref: string): number => {
    // Basic normalization: remove chapter/verse numbers
    // e.g., "Isaiah 53:5" -> "Isaiah"
    const bookName = ref.split(/\d+:/)[0].replace(/\d+$/, '').trim();
    
    // Attempt to match against DB
    const index = BIBLE_BOOKS.findIndex(b => 
      b.en.toLowerCase() === bookName.toLowerCase() || 
      b.ru.toLowerCase() === bookName.toLowerCase() ||
      bookName.toLowerCase().includes(b.en.toLowerCase()) ||
      bookName.toLowerCase().includes(b.ru.toLowerCase())
    );

    return index;
  };

  const arcs = useMemo(() => {
    return data.map((item, idx) => {
      const startIndex = getBookIndex(item.primary_verse);
      const endIndex = getBookIndex(item.related_verse);
      
      return {
        ...item,
        startIndex: startIndex === -1 ? 0 : startIndex,
        endIndex: endIndex === -1 ? BIBLE_BOOKS.length - 1 : endIndex,
        originalIdx: idx
      };
    }).filter(a => a.startIndex !== a.endIndex); // Filter out self-loops for this chart for clarity
  }, [data]);

  // Dimensions
  const width = 1000;
  const height = 400;
  const margin = { top: 40, right: 40, bottom: 60, left: 40 };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  // Scale
  const xScale = (index: number) => (index / (BIBLE_BOOKS.length - 1)) * graphWidth;

  if (!data || data.length === 0) return null;

  return (
    <div className="bg-[#0f172a] rounded-xl shadow-lg border border-indigo-900/50 overflow-hidden text-white relative">
      {/* Header */}
      <div className="p-6 border-b border-indigo-900/30 flex items-center gap-3 bg-[#0f172a] relative z-10">
        <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
          <Sparkles size={24} />
        </div>
        <div>
          <h3 className="text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-indigo-200">
            {t.title}
          </h3>
          <p className="text-sm text-indigo-300/60 font-light">{t.subtitle}</p>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <div style={{ width: '100%', minWidth: '800px' }}>
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            <defs>
              <linearGradient id="arcGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={height}>
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" /> {/* Amber/Gold */}
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" /> {/* Indigo */}
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {/* Baseline */}
              <line 
                x1="0" 
                y1={graphHeight} 
                x2={graphWidth} 
                y2={graphHeight} 
                stroke="#334155" 
                strokeWidth="1" 
              />

              {/* Major Divisions */}
              {[0, 39].map(idx => (
                 <text 
                   key={idx}
                   x={xScale(idx)} 
                   y={graphHeight + 30} 
                   fill="#94a3b8" 
                   fontSize="12" 
                   fontWeight="bold"
                   textAnchor="middle"
                 >
                   {idx === 0 ? t.ot : t.nt}
                 </text>
              ))}

              {/* Book Ticks */}
              {BIBLE_BOOKS.map((book, i) => (
                <g key={i} transform={`translate(${xScale(i)}, ${graphHeight})`}>
                  <circle cx="0" cy="0" r="2" fill={i < 39 ? "#fbbf24" : "#818cf8"} opacity="0.6" />
                  {/* Show label only for significant books to avoid clutter */}
                  {(i === 0 || i === 39 || i === 65 || i % 10 === 0) && (
                    <text 
                      y="15" 
                      textAnchor="middle" 
                      fill="#64748b" 
                      fontSize="9"
                      opacity="0.7"
                    >
                      {language === AppLanguage.ENGLISH ? book.en.substring(0, 3) : book.ru.substring(0, 3)}
                    </text>
                  )}
                </g>
              ))}

              {/* Arcs */}
              {arcs.map((arc, i) => {
                const x1 = xScale(arc.startIndex);
                const x2 = xScale(arc.endIndex);
                const distance = Math.abs(x2 - x1);
                const y = graphHeight;
                
                // Height of arc depends on distance
                const arcHeight = Math.min(graphHeight - 20, distance * 0.8 + 20);
                const controlY = y - arcHeight * 1.5;

                const isHovered = hoveredArc === i;

                return (
                  <g key={i} 
                     onMouseEnter={() => setHoveredArc(i)}
                     onMouseLeave={() => setHoveredArc(null)}
                     className="cursor-pointer transition-all duration-300"
                  >
                    <path
                      d={`M ${x1} ${y} Q ${(x1 + x2) / 2} ${controlY} ${x2} ${y}`}
                      fill="none"
                      stroke={isHovered ? "#fbbf24" : "url(#arcGradient)"}
                      strokeWidth={isHovered ? 3 : 1.5}
                      strokeOpacity={isHovered ? 1 : 0.6}
                      filter={isHovered ? "url(#glow)" : ""}
                    />
                    {isHovered && (
                      <circle cx={x2} cy={y} r="4" fill="#fbbf24" />
                    )}
                     {isHovered && (
                      <circle cx={x1} cy={y} r="4" fill="#fbbf24" />
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Tooltip Overlay */}
        {hoveredArc !== null && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md text-white p-4 rounded-xl border border-amber-500/30 shadow-2xl max-w-sm pointer-events-none z-20 transition-all duration-300 animate-fade-in">
             <div className="flex items-center gap-2 mb-2">
                <span className="font-serif font-bold text-amber-400">{arcs[hoveredArc].primary_verse}</span>
                <ArrowRight size={14} className="text-gray-400" />
                <span className="font-serif font-bold text-indigo-400">{arcs[hoveredArc].related_verse}</span>
             </div>
             <div className="text-xs font-bold uppercase tracking-wider bg-white/10 inline-block px-2 py-0.5 rounded mb-2 text-gray-300">
                {arcs[hoveredArc].connection_type}
             </div>
             <p className="text-sm text-gray-300 italic leading-relaxed">
               {arcs[hoveredArc].description}
             </p>
          </div>
        )}

        <div className="absolute bottom-2 right-4 text-[10px] text-slate-600 italic">
          *Canonical Axis (Gen -&gt; Rev)
        </div>
      </div>
    </div>
  );
};