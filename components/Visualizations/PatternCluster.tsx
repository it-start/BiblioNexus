
import React, { useMemo, useState, useEffect } from 'react';
import { Citation, CrossReference, AppLanguage } from '../../types';
import { ScanSearch, GitCommit, Copy, Layers, Link as LinkIcon, X } from 'lucide-react';

interface PatternClusterProps {
  citations: Citation[];
  crossReferences: CrossReference[];
  language?: AppLanguage;
  filterRefs?: { ref1: string, ref2: string } | null;
}

interface Cluster {
  phrase: string;
  count: number;
  length: number; // number of words
  sources: Array<{ ref: string; fullText: string }>;
}

export const PatternCluster: React.FC<PatternClusterProps> = ({ citations, crossReferences, language = AppLanguage.ENGLISH, filterRefs }) => {
  const [minWords, setMinWords] = useState(2);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  const t = {
    title: language === AppLanguage.RUSSIAN ? "Анализ текстовых кластеров" : "Textual Cluster Analysis",
    subtitle: language === AppLanguage.RUSSIAN ? "Обнаружение повторяющихся цепочек слов (N-граммы)" : "Detecting repetitive word chains (N-grams)",
    phrase: language === AppLanguage.RUSSIAN ? "Фраза / Паттерн" : "Phrase / Pattern",
    freq: language === AppLanguage.RUSSIAN ? "Частота" : "Freq",
    sources: language === AppLanguage.RUSSIAN ? "Источники" : "Sources",
    lengthFilter: language === AppLanguage.RUSSIAN ? "Длина фразы" : "Phrase Length",
    noClusters: language === AppLanguage.RUSSIAN ? "Повторяющихся паттернов не найдено." : "No repetitive patterns found.",
    words: language === AppLanguage.RUSSIAN ? "слова" : "words",
    occurrences: language === AppLanguage.RUSSIAN ? "вхождений" : "occurrences",
    filteredView: language === AppLanguage.RUSSIAN ? "Фильтр: Соединение дуг" : "Filter: Arc Connection",
    clearFilter: language === AppLanguage.RUSSIAN ? "Очистить" : "Clear"
  };

  // Logic: N-Gram extraction
  const clusters = useMemo(() => {
    // If filtering by refs, we only care about text from those specific references or the whole set
    const relevantRefs = new Set(filterRefs ? [filterRefs.ref1, filterRefs.ref2] : []);

    const allTexts = [
      ...citations.map(c => ({ ref: `${c.book} ${c.chapter}:${c.verse_start}`, text: c.text })),
      ...crossReferences.map(c => ({ ref: c.primary_verse, text: c.primary_text })),
      ...crossReferences.map(c => ({ ref: c.related_verse, text: c.related_text }))
    ];

    // Normalize text
    const normalize = (str: string) => str.toLowerCase().replace(/[^\p{L}\s]/gu, "").replace(/\s+/g, " ").trim();
    
    // Stopwords (basic list for En/Ru to filter noise)
    const stopWords = new Set([
      'the', 'and', 'of', 'to', 'in', 'that', 'it', 'is', 'for', 'was', 'with', 'on', 'as', 'he', 'be', 'at', 'by', 'my', 'unto', 'hath', 'shalt', 'thou', 'thy', 'not', 'but', 'from', 'his', 'him', 'they', 'them', 'are', 'this',
      'и', 'в', 'не', 'на', 'я', 'что', 'то', 'с', 'он', 'а', 'как', 'по', 'но', 'к', 'у', 'из', 'за', 'от', 'ты', 'же', 'о', 'для', 'вот', 'все', 'до', 'если', 'или', 'так', 'было', 'его'
    ]);

    const phraseMap = new Map<string, Array<{ ref: string; fullText: string }>>();

    allTexts.forEach(({ ref, text }) => {
      if (!text) return;
      const cleanText = normalize(text);
      const words = cleanText.split(' ');

      // Generate N-grams (from minWords up to 5)
      for (let n = minWords; n <= 6; n++) {
        for (let i = 0; i <= words.length - n; i++) {
          const slice = words.slice(i, i + n);
          
          // Filter out phrases that are just stopwords
          const significantWords = slice.filter(w => !stopWords.has(w));
          if (significantWords.length === 0) continue;

          const phrase = slice.join(' ');
          
          if (!phraseMap.has(phrase)) {
            phraseMap.set(phrase, []);
          }
          const entry = phraseMap.get(phrase);
          // Avoid duplicate refs for the same phrase
          if (entry && !entry.some(e => e.ref === ref)) {
            entry.push({ ref, fullText: text });
          }
        }
      }
    });

    // Filter clusters: must appear in at least 2 different sources
    const result: Cluster[] = [];
    phraseMap.forEach((sources, phrase) => {
      if (sources.length > 1) {
        // If external filter is active, this cluster MUST contain source text from BOTH refs
        // This is tricky because refs might be fuzzy (Book Ch:V vs Book Ch:V-V)
        // Simple check: does the cluster appear in texts associated with the filtered refs?
        if (filterRefs) {
            const hasRef1 = sources.some(s => s.ref.includes(filterRefs.ref1) || filterRefs.ref1.includes(s.ref));
            const hasRef2 = sources.some(s => s.ref.includes(filterRefs.ref2) || filterRefs.ref2.includes(s.ref));
            
            if (hasRef1 && hasRef2) {
                result.push({ phrase, count: sources.length, length: phrase.split(' ').length, sources });
            }
        } else {
            result.push({ phrase, count: sources.length, length: phrase.split(' ').length, sources });
        }
      }
    });

    // Remove sub-clusters (e.g. if "word of god" exists, remove "of god" if it has same count)
    // Sort by length desc first
    result.sort((a, b) => b.length - a.length);
    
    const finalClusters: Cluster[] = [];

    for (const cluster of result) {
       // Check if this phrase is part of a larger phrase already claimed with similar count
       let isSubSet = false;
       for (const larger of finalClusters) {
         if (larger.phrase.includes(cluster.phrase) && Math.abs(larger.count - cluster.count) <= 1) {
           isSubSet = true;
           break;
         }
       }
       if (!isSubSet) {
         finalClusters.push(cluster);
       }
    }

    // Final sort: Frequency then Length
    return finalClusters.sort((a, b) => b.count - a.count || b.length - a.length).slice(0, 15); // Top 15
  }, [citations, crossReferences, minWords, filterRefs]);

  // Auto-select first cluster if filtering logic found something
  useEffect(() => {
    if (filterRefs && clusters.length > 0) {
        setSelectedCluster(clusters[0].phrase);
    } else if (filterRefs && clusters.length === 0) {
        setSelectedCluster(null);
    }
  }, [filterRefs, clusters]);

  if (clusters.length === 0 && !filterRefs) return null;

  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-colors ${filterRefs ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-stone-200'}`}>
      <div className="bg-stone-50 p-6 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-teal-100 p-2 rounded-lg text-teal-700">
            <ScanSearch size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
                <h3 className="text-xl font-serif font-bold text-gray-900">{t.title}</h3>
                {filterRefs && (
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider bg-indigo-600 text-white px-2 py-0.5 rounded-full animate-fade-in">
                        <LinkIcon size={10} /> {t.filteredView}
                    </span>
                )}
            </div>
            <p className="text-sm text-gray-500">{t.subtitle}</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-stone-200 shadow-sm">
          <Layers size={14} className="text-gray-400" />
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{t.lengthFilter}:</span>
          {[2, 3, 4].map(n => (
            <button
              key={n}
              onClick={() => setMinWords(n)}
              className={`text-xs w-6 h-6 rounded flex items-center justify-center font-bold transition-colors ${
                minWords === n ? 'bg-teal-600 text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-100">
        
        {/* Cluster List */}
        <div className="col-span-1 max-h-[400px] overflow-y-auto p-2 bg-stone-50/50">
          {clusters.length === 0 ? (
             <div className="p-8 text-center text-gray-400 italic text-sm">
                {t.noClusters}
                {filterRefs && <div className="mt-2 text-xs">Try reducing phrase length.</div>}
             </div>
          ) : (
            clusters.map((cluster, idx) => (
                <button
                key={idx}
                onClick={() => setSelectedCluster(cluster.phrase)}
                className={`w-full text-left p-3 rounded-lg mb-1 flex items-center justify-between group transition-all ${
                    selectedCluster === cluster.phrase 
                    ? 'bg-white shadow-md border-l-4 border-teal-500 ring-1 ring-black/5' 
                    : 'hover:bg-white hover:shadow-sm border-l-4 border-transparent'
                }`}
                >
                <div className="flex items-center gap-2 overflow-hidden">
                    <GitCommit size={14} className={`shrink-0 ${selectedCluster === cluster.phrase ? 'text-teal-500' : 'text-gray-300'}`} />
                    <span className={`font-medium truncate ${selectedCluster === cluster.phrase ? 'text-teal-900' : 'text-gray-700'}`}>
                    "{cluster.phrase}"
                    </span>
                </div>
                <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                    selectedCluster === cluster.phrase ? 'bg-teal-100 text-teal-700' : 'bg-stone-200 text-stone-500'
                }`}>
                    {cluster.count}
                </div>
                </button>
            ))
          )}
        </div>

        {/* Details Panel */}
        <div className="col-span-2 p-6 bg-white min-h-[300px]">
          {selectedCluster && clusters.length > 0 ? (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-stone-100">
                 <Copy size={18} className="text-teal-500" />
                 <h4 className="text-lg font-serif font-bold text-gray-900">
                   "{selectedCluster}"
                 </h4>
                 <span className="text-xs bg-stone-100 text-stone-500 px-2 py-1 rounded-full ml-auto">
                    {clusters.find(c => c.phrase === selectedCluster)?.count} {t.occurrences}
                 </span>
              </div>
              
              <div className="space-y-4">
                {clusters.find(c => c.phrase === selectedCluster)?.sources.map((src, i) => (
                  <div key={i} className="group">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-indigo-700 font-serif text-sm">{src.ref}</span>
                      <div className="h-px bg-stone-100 flex-1"></div>
                    </div>
                    <p className="text-gray-600 text-sm italic leading-relaxed pl-4 border-l-2 border-stone-200 group-hover:border-teal-300 transition-colors">
                      {src.fullText.split(new RegExp(`(${selectedCluster})`, 'gi')).map((part, pIdx) => (
                         part.toLowerCase() === selectedCluster.toLowerCase() 
                           ? <span key={pIdx} className="bg-teal-100 text-teal-900 font-semibold px-1 rounded">{part}</span>
                           : <span key={pIdx}>{part}</span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
               <ScanSearch size={48} className="opacity-20" />
               <p className="text-sm">{t.noClusters}</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
