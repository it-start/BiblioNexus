
import React, { useMemo, useState } from 'react';
import { CrossReference, AppLanguage } from '../../types';
import { Sparkles, ArrowRight, MousePointer2 } from 'lucide-react';

interface PropheticArcsProps {
  data: CrossReference[];
  language?: AppLanguage;
  onSelectArc?: (ref: CrossReference | null) => void;
}

// Canonical order of Bible books with Chapter counts for precision mapping
const BIBLE_BOOKS = [
  // Old Testament
  { en: "Genesis", ru: "Бытие", div: "Pentateuch", chapters: 50 },
  { en: "Exodus", ru: "Исход", div: "Pentateuch", chapters: 40 },
  { en: "Leviticus", ru: "Левит", div: "Pentateuch", chapters: 27 },
  { en: "Numbers", ru: "Числа", div: "Pentateuch", chapters: 36 },
  { en: "Deuteronomy", ru: "Второзаконие", div: "Pentateuch", chapters: 34 },
  { en: "Joshua", ru: "Иисус Навин", div: "History", chapters: 24 },
  { en: "Judges", ru: "Судьи", div: "History", chapters: 21 },
  { en: "Ruth", ru: "Руфь", div: "History", chapters: 4 },
  { en: "1 Samuel", ru: "1 Царств", div: "History", chapters: 31 },
  { en: "2 Samuel", ru: "2 Царств", div: "History", chapters: 24 },
  { en: "1 Kings", ru: "3 Царств", div: "History", chapters: 22 },
  { en: "2 Kings", ru: "4 Царств", div: "History", chapters: 25 },
  { en: "1 Chronicles", ru: "1 Паралипоменон", div: "History", chapters: 29 },
  { en: "2 Chronicles", ru: "2 Паралипоменон", div: "History", chapters: 36 },
  { en: "Ezra", ru: "Ездра", div: "History", chapters: 10 },
  { en: "Nehemiah", ru: "Неемия", div: "History", chapters: 13 },
  { en: "Esther", ru: "Есфирь", div: "History", chapters: 10 },
  { en: "Job", ru: "Иов", div: "Poetry", chapters: 42 },
  { en: "Psalms", ru: "Псалтирь", div: "Poetry", chapters: 150 },
  { en: "Proverbs", ru: "Притчи", div: "Poetry", chapters: 31 },
  { en: "Ecclesiastes", ru: "Екклесиаст", div: "Poetry", chapters: 12 },
  { en: "Song of Solomon", ru: "Песня Песней", div: "Poetry", chapters: 8 },
  { en: "Isaiah", ru: "Исаия", div: "Prophets", chapters: 66 },
  { en: "Jeremiah", ru: "Иеремия", div: "Prophets", chapters: 52 },
  { en: "Lamentations", ru: "Плач Иеремии", div: "Prophets", chapters: 5 },
  { en: "Ezekiel", ru: "Иезекииль", div: "Prophets", chapters: 48 },
  { en: "Daniel", ru: "Даниил", div: "Prophets", chapters: 12 },
  { en: "Hosea", ru: "Осия", div: "Prophets", chapters: 14 },
  { en: "Joel", ru: "Иоиль", div: "Prophets", chapters: 3 },
  { en: "Amos", ru: "Амос", div: "Prophets", chapters: 9 },
  { en: "Obadiah", ru: "Авдий", div: "Prophets", chapters: 1 },
  { en: "Jonah", ru: "Иона", div: "Prophets", chapters: 4 },
  { en: "Micah", ru: "Михей", div: "Prophets", chapters: 7 },
  { en: "Nahum", ru: "Наум", div: "Prophets", chapters: 3 },
  { en: "Habakkuk", ru: "Аввакум", div: "Prophets", chapters: 3 },
  { en: "Zephaniah", ru: "Софония", div: "Prophets", chapters: 3 },
  { en: "Haggai", ru: "Аггей", div: "Prophets", chapters: 2 },
  { en: "Zechariah", ru: "Захария", div: "Prophets", chapters: 14 },
  { en: "Malachi", ru: "Малахия", div: "Prophets", chapters: 4 },
  // New Testament
  { en: "Matthew", ru: "От Матфея", div: "Gospels", chapters: 28 },
  { en: "Mark", ru: "От Марка", div: "Gospels", chapters: 16 },
  { en: "Luke", ru: "От Луки", div: "Gospels", chapters: 24 },
  { en: "John", ru: "От Иоанна", div: "Gospels", chapters: 21 },
  { en: "Acts", ru: "Деяния", div: "History", chapters: 28 },
  { en: "Romans", ru: "Римлянам", div: "Epistles", chapters: 16 },
  { en: "1 Corinthians", ru: "1 Коринфянам", div: "Epistles", chapters: 16 },
  { en: "2 Corinthians", ru: "2 Коринфянам", div: "Epistles", chapters: 13 },
  { en: "Galatians", ru: "Галатам", div: "Epistles", chapters: 6 },
  { en: "Ephesians", ru: "Ефесянам", div: "Epistles", chapters: 6 },
  { en: "Philippians", ru: "Филиппийцам", div: "Epistles", chapters: 4 },
  { en: "Colossians", ru: "Колоссянам", div: "Epistles", chapters: 4 },
  { en: "1 Thessalonians", ru: "1 Фессалоникийцам", div: "Epistles", chapters: 5 },
  { en: "2 Thessalonians", ru: "2 Фессалоникийцам", div: "Epistles", chapters: 3 },
  { en: "1 Timothy", ru: "1 Тимофею", div: "Epistles", chapters: 6 },
  { en: "2 Timothy", ru: "2 Тимофею", div: "Epistles", chapters: 4 },
  { en: "Titus", ru: "Титу", div: "Epistles", chapters: 3 },
  { en: "Philemon", ru: "Филимону", div: "Epistles", chapters: 1 },
  { en: "Hebrews", ru: "Евреям", div: "Epistles", chapters: 13 },
  { en: "James", ru: "Иакова", div: "Epistles", chapters: 5 },
  { en: "1 Peter", ru: "1 Петра", div: "Epistles", chapters: 5 },
  { en: "2 Peter", ru: "2 Петра", div: "Epistles", chapters: 3 },
  { en: "1 John", ru: "1 Иоанна", div: "Epistles", chapters: 5 },
  { en: "2 John", ru: "2 Иоанна", div: "Epistles", chapters: 1 },
  { en: "3 John", ru: "3 Иоанна", div: "Epistles", chapters: 1 },
  { en: "Jude", ru: "Иуды", div: "Epistles", chapters: 1 },
  { en: "Revelation", ru: "Откровение", div: "Prophecy", chapters: 22 }
];

export const PropheticArcs: React.FC<PropheticArcsProps> = ({ data, language = AppLanguage.ENGLISH, onSelectArc }) => {
  const [hoveredArc, setHoveredArc] = useState<number | null>(null);
  const [selectedArcIndex, setSelectedArcIndex] = useState<number | null>(null);

  const t = {
    title: language === AppLanguage.RUSSIAN ? "Пророческая траектория (Deep:3)" : "Prophetic Trajectory (Deep:3)",
    subtitle: language === AppLanguage.RUSSIAN ? "Божественные дуги: точное отображение связей" : "Divine arcs: precision cross-reference mapping",
    ot: "OT",
    nt: "NT",
    instruction: language === AppLanguage.RUSSIAN ? "Нажмите на дугу, чтобы увидеть общие слова" : "Click an arc to reveal shared patterns"
  };

  // Helper to extract Book Name and Chapter Number
  const parseReference = (ref: string) => {
    // Regex to capture "1 John 5:1" -> Book: "1 John", Chapter: 5
    // or "Genesis 1:1" -> Book: "Genesis", Chapter: 1
    // Handles Russian "От Матфея 24:16"
    
    // Split by last colon or space-digit
    const match = ref.match(/^(.+?)\s+(\d+):/);
    if (match) {
      return { book: match[1].trim(), chapter: parseInt(match[2]) };
    }
    // Fallback if no chapter found (entire book ref)
    return { book: ref.trim(), chapter: 1 };
  };

  const getPrecisePosition = (ref: string): number => {
    const { book, chapter } = parseReference(ref);
    const bookIndex = BIBLE_BOOKS.findIndex(b => 
      b.en.toLowerCase() === book.toLowerCase() || 
      b.ru.toLowerCase() === book.toLowerCase() ||
      book.toLowerCase().includes(b.en.toLowerCase()) ||
      book.toLowerCase().includes(b.ru.toLowerCase())
    );

    if (bookIndex === -1) return -1;

    const bookData = BIBLE_BOOKS[bookIndex];
    // Calculate progress within the book (0.0 to 0.99)
    // If chapter > max, clamp it.
    const chapterProgress = Math.min((chapter - 1) / Math.max(bookData.chapters, 1), 0.9);
    
    return bookIndex + chapterProgress;
  };

  const arcs = useMemo(() => {
    return data.map((item, idx) => {
      const startPos = getPrecisePosition(item.primary_verse);
      const endPos = getPrecisePosition(item.related_verse);
      
      return {
        ...item,
        startPos: startPos === -1 ? 0 : startPos,
        endPos: endPos === -1 ? BIBLE_BOOKS.length - 1 : endPos,
        originalIdx: idx
      };
    }).filter(a => Math.abs(a.startPos - a.endPos) > 0.1); // Filter out extremely short intra-book links for this global view
  }, [data]);

  const handleArcClick = (index: number) => {
    if (selectedArcIndex === index) {
        setSelectedArcIndex(null);
        if (onSelectArc) onSelectArc(null);
    } else {
        setSelectedArcIndex(index);
        if (onSelectArc) onSelectArc(arcs[index]);
    }
  };

  // Dimensions
  const width = 1000;
  const height = 450;
  const margin = { top: 60, right: 40, bottom: 60, left: 40 };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  // Scale: Mapping 0..66 to 0..graphWidth
  const xScale = (pos: number) => (pos / (BIBLE_BOOKS.length)) * graphWidth;

  if (!data || data.length === 0) return null;

  return (
    <div className="bg-[#0b0f19] rounded-xl shadow-2xl border border-indigo-900/50 overflow-hidden text-white relative group">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(17,24,39,0)_1px,transparent_1px),linear-gradient(90deg,rgba(17,24,39,0)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none"></div>

      {/* Header */}
      <div className="p-6 border-b border-indigo-900/30 flex items-center justify-between bg-[#0b0f19] relative z-10">
        <div className="flex items-center gap-3">
            <div className="bg-indigo-500/10 p-2 rounded-lg text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Sparkles size={24} />
            </div>
            <div>
            <h3 className="text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-indigo-200">
                {t.title}
            </h3>
            <p className="text-sm text-indigo-300/60 font-light">{t.subtitle}</p>
            </div>
        </div>
        <div className="hidden md:flex text-[10px] text-indigo-400/50 uppercase tracking-widest border border-indigo-900/30 px-3 py-1 rounded-full items-center gap-2">
            <MousePointer2 size={12} /> {t.instruction}
        </div>
      </div>

      <div className="relative overflow-x-auto custom-scrollbar">
        <div style={{ width: '100%', minWidth: '900px' }}>
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            <defs>
              <linearGradient id="arcGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={height}>
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" /> {/* Gold Promise */}
                <stop offset="50%" stopColor="#f472b6" stopOpacity="0.5" /> {/* Pink Transition */}
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.9" /> {/* Indigo Fulfillment */}
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
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
                strokeWidth="2" 
                strokeLinecap="round"
              />

              {/* Major Divisions (OT/NT) */}
              <text x={xScale(0)} y={graphHeight + 40} fill="#64748b" fontSize="14" fontWeight="bold" opacity="0.5">GEN</text>
              <text x={xScale(39)} y={graphHeight + 40} fill="#fbbf24" fontSize="14" fontWeight="bold" textAnchor="middle" opacity="0.8">✝ {t.nt}</text>
              <text x={xScale(65)} y={graphHeight + 40} fill="#64748b" fontSize="14" fontWeight="bold" textAnchor="end" opacity="0.5">REV</text>

              {/* Book Ticks */}
              {BIBLE_BOOKS.map((book, i) => (
                <g key={i} transform={`translate(${xScale(i)}, ${graphHeight})`}>
                  {/* Tick line */}
                  <line y1="0" y2="5" stroke={i < 39 ? "#475569" : "#6366f1"} strokeWidth={i % 5 === 0 ? 2 : 1} opacity="0.5" />
                  
                  {/* Hover Hitbox for Book Name */}
                  <rect x="-5" y="0" width="10" height="20" fill="transparent">
                    <title>{language === AppLanguage.ENGLISH ? book.en : book.ru} ({book.chapters} ch)</title>
                  </rect>
                </g>
              ))}

              {/* Arcs */}
              {arcs.map((arc, i) => {
                const x1 = xScale(arc.startPos);
                const x2 = xScale(arc.endPos);
                const distance = Math.abs(x2 - x1);
                const y = graphHeight;
                
                // Height of arc depends on distance (Prophetic span)
                // Max height constrained to stay within view
                const arcHeight = Math.min(graphHeight - 20, distance * 0.6 + 40);
                const controlY = y - arcHeight * 1.8; // Control point pulls curve up

                const isHovered = hoveredArc === i;
                const isSelected = selectedArcIndex === i;
                const opacity = (hoveredArc === null && selectedArcIndex === null) ? 0.6 : ((isHovered || isSelected) ? 1 : 0.1);

                return (
                  <g key={i} 
                     onMouseEnter={() => setHoveredArc(i)}
                     onMouseLeave={() => setHoveredArc(null)}
                     onClick={() => handleArcClick(i)}
                     className="cursor-pointer transition-all duration-300"
                  >
                    {/* Hitbox Path (Invisible, thicker) */}
                    <path
                      d={`M ${x1} ${y} Q ${(x1 + x2) / 2} ${controlY} ${x2} ${y}`}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="20"
                    />

                    {/* Visible Arc */}
                    <path
                      d={`M ${x1} ${y} Q ${(x1 + x2) / 2} ${controlY} ${x2} ${y}`}
                      fill="none"
                      stroke={(isHovered || isSelected) ? "#fbbf24" : "url(#arcGradient)"}
                      strokeWidth={(isHovered || isSelected) ? 3 : 1.5}
                      strokeOpacity={opacity}
                      filter={(isHovered || isSelected) ? "url(#glow)" : ""}
                      strokeLinecap="round"
                    />
                    
                    {/* Precise Start/End Dots */}
                    {(isHovered || isSelected || (hoveredArc === null && selectedArcIndex === null)) && (
                      <>
                        <circle cx={x1} cy={y} r={(isHovered || isSelected) ? 4 : 2} fill="#fbbf24" opacity={opacity} />
                        <circle cx={x2} cy={y} r={(isHovered || isSelected) ? 4 : 2} fill="#6366f1" opacity={opacity} />
                      </>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Dynamic Tooltip Overlay */}
        {hoveredArc !== null && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-[#0b0f19]/90 backdrop-blur-md text-white p-4 rounded-xl border border-amber-500/30 shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-sm pointer-events-none z-20 animate-fade-in text-center">
             <div className="flex items-center justify-center gap-3 mb-2">
                <span className="font-serif font-bold text-amber-400 text-lg">{arcs[hoveredArc].primary_verse}</span>
                <ArrowRight size={16} className="text-gray-500" />
                <span className="font-serif font-bold text-indigo-400 text-lg">{arcs[hoveredArc].related_verse}</span>
             </div>
             <div className="text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-amber-900/40 to-indigo-900/40 border border-white/10 px-2 py-1 rounded mb-3 text-gray-300 inline-block">
                {arcs[hoveredArc].connection_type}
             </div>
             <p className="text-sm text-gray-300 italic leading-relaxed font-serif">
               "{arcs[hoveredArc].description}"
             </p>
          </div>
        )}

        <div className="absolute bottom-2 right-4 text-[10px] text-slate-600 italic">
          *Canonical Axis (Gen -> Rev) • Precise Chapter Mapping
        </div>
      </div>
    </div>
  );
};
