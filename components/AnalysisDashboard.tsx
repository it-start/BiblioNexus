
import React, { useState } from 'react';
import { AnalysisData, Relationship, AppLanguage, CouncilSession, CrossReference } from '../types';
import { ThemeChart } from './Visualizations/ThemeChart';
import { NetworkGraph } from './Visualizations/NetworkGraph';
import { DistributionChart } from './Visualizations/DistributionChart';
import { TimelineChart } from './Visualizations/TimelineChart';
import { BiblicalMap } from './Visualizations/BiblicalMap';
import { ScriptureDNA } from './Visualizations/ScriptureDNA';
import { BiblicalAlgorithm } from './Visualizations/BiblicalAlgorithm';
import { PropheticArcs } from './Visualizations/PropheticArcs';
import { PatternCluster } from './Visualizations/PatternCluster';
import { BioGeneticAnalysis } from './Visualizations/BioGeneticAnalysis';
import { EtymologicalPrism } from './Visualizations/EtymologicalPrism';
import { ChronoMap } from './Visualizations/ChronoMap';
import { PeerReviewPanel } from './PeerReviewPanel';
import { ApologeticsPanel } from './ApologeticsPanel';
import { TheCouncil } from './TheCouncil';
import { conveneCouncil } from '../services/geminiService';
import { BookOpen, Share2, Activity, Info, Anchor, FileText, Network, History, Gavel, Loader2, Sparkles } from 'lucide-react';

interface AnalysisDashboardProps {
  data: AnalysisData;
  language?: AppLanguage;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data, language = AppLanguage.ENGLISH }) => {
  const [councilSession, setCouncilSession] = useState<CouncilSession | null>(null);
  const [loadingCouncil, setLoadingCouncil] = useState(false);
  const [selectedArc, setSelectedArc] = useState<{ref1: string, ref2: string} | null>(null);
  
  const t = {
    summary: language === AppLanguage.RUSSIAN ? "Богословское резюме" : "Theological Summary",
    context: language === AppLanguage.RUSSIAN ? "Исторический контекст" : "Historical Context",
    timeline: language === AppLanguage.RUSSIAN ? "Хронология событий" : "Timeline of Events",
    insight: language === AppLanguage.RUSSIAN ? "Глубокое богословское понимание" : "Deep Theological Insight",
    footprint: language === AppLanguage.RUSSIAN ? "Библейский след" : "Scriptural Footprint",
    distDesc: language === AppLanguage.RUSSIAN ? "Распределение ссылок по книгам Библии." : "Distribution of references across biblical books.",
    interconnections: language === AppLanguage.RUSSIAN ? "Библейские взаимосвязи" : "Scriptural Interconnections",
    interDesc: language === AppLanguage.RUSSIAN ? "Визуализация того, как Писание толкует Писание (напр., Пророчество → Исполнение)." : "Visualizing how scripture interprets scripture (e.g., Prophecy → Fulfillment).",
    hoverHint: language === AppLanguage.RUSSIAN ? "Наведите на линии связи, чтобы увидеть детали." : "Hover over connection lines to see connection details.",
    resonance: language === AppLanguage.RUSSIAN ? "Тематический резонанс" : "Thematic Resonance",
    figures: language === AppLanguage.RUSSIAN ? "Сеть ключевых фигур" : "Key Figures Network",
    crossRefs: language === AppLanguage.RUSSIAN ? "Детали перекрестных ссылок" : "Deep Cross-Reference Details",
    citations: language === AppLanguage.RUSSIAN ? "Проверенные библейские цитаты" : "Verified Scriptural Citations",
    verified: language === AppLanguage.RUSSIAN ? "Проверено" : "Verified",
    relevance: language === AppLanguage.RUSSIAN ? "Значение" : "Relevance",
    convene: language === AppLanguage.RUSSIAN ? "Созвать Совет Трех" : "Convene The Council of Three",
    convening: language === AppLanguage.RUSSIAN ? "Совет собирается..." : "Convening Council...",
    councilDesc: language === AppLanguage.RUSSIAN ? "Запустите дебаты в реальном времени между Археологом, Богословом и Мистиком для получения синтезированной мудрости." : "Initiate a real-time debate between the Archaeologist, Theologian, and Mystic for synthesized wisdom.",
    canonResonance: language === AppLanguage.RUSSIAN ? "Канонический Резонанс" : "Canonical Resonance",
    canonDesc: language === AppLanguage.RUSSIAN ? "Макро-траектории пророчеств и микро-паттерны текста." : "Macro prophetic trajectories meeting micro textual patterns."
  };

  const handleConveneCouncil = async () => {
    const topic = data.themes[0]?.name || "Theological Analysis"; 
    setLoadingCouncil(true);
    try {
      const session = await conveneCouncil(topic, language);
      setCouncilSession(session);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCouncil(false);
    }
  };

  const handleArcSelect = (ref: CrossReference | null) => {
    if (ref) {
        setSelectedArc({ ref1: ref.primary_verse, ref2: ref.related_verse });
    } else {
        setSelectedArc(null);
    }
  };

  const crossReferenceRelationships: Relationship[] = data.cross_references?.map(ref => ({
    source: ref.primary_verse,
    target: ref.related_verse,
    type: ref.connection_type,
    strength: 5, 
    description: ref.description
  })) || [];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* Top Section: Summary & Context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 mb-4 text-indigo-800">
            <BookOpen className="w-5 h-5" />
            <h2 className="text-xl font-serif font-bold">{t.summary}</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg font-light">
            {data.summary}
          </p>
        </div>

        <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
          <div className="flex items-center gap-2 mb-4 text-amber-700">
            <Info className="w-5 h-5" />
            <h3 className="text-lg font-serif font-bold">{t.context}</h3>
          </div>
          <p className="text-sm text-gray-600 italic leading-relaxed">
            {data.historical_context}
          </p>
        </div>
      </div>

      {/* Council of Three Integration */}
      {!councilSession ? (
        <div className="bg-gradient-to-r from-stone-900 to-stone-800 rounded-xl p-8 text-center shadow-xl border border-stone-700">
           <Gavel size={48} className="mx-auto text-amber-500 mb-4 opacity-80" />
           <h3 className="text-2xl font-serif font-bold text-white mb-2">{t.convene}</h3>
           <p className="text-stone-400 mb-6 max-w-lg mx-auto">{t.councilDesc}</p>
           <button 
             onClick={handleConveneCouncil}
             disabled={loadingCouncil}
             className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-bold tracking-wide transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center gap-2 mx-auto"
           >
             {loadingCouncil ? <Loader2 className="animate-spin" /> : <Gavel size={18} />}
             {loadingCouncil ? t.convening : t.convene}
           </button>
        </div>
      ) : (
        <TheCouncil session={councilSession} language={language} />
      )}

      {/* Peer Review Panel (Mistral) */}
      {data.peer_review && (
        <div className="my-8">
          <PeerReviewPanel review={data.peer_review} language={language} />
        </div>
      )}

      {/* Apologetics Panel (Cohere) */}
      {data.apologetics && (
        <div className="my-8">
          <ApologeticsPanel data={data.apologetics} language={language} />
        </div>
      )}

      {/* Deep Insight */}
      <div className="bg-indigo-50 p-8 rounded-xl border border-indigo-100">
        <h3 className="text-xl font-serif font-bold text-indigo-900 mb-4">{t.insight}</h3>
        <p className="text-indigo-900/80 leading-relaxed font-serif text-lg">
          {data.theological_insight}
        </p>
      </div>

      {/* Canonical Resonance Section (Unified Arcs + Pattern Clusters) */}
      {(data.cross_references?.length > 0 || data.citations?.length > 0) && (
        <div className="bg-stone-100/50 p-6 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-2 mb-4 text-indigo-900">
                <Sparkles className="w-6 h-6" />
                <div>
                    <h3 className="text-xl font-serif font-bold">{t.canonResonance}</h3>
                    <p className="text-xs text-stone-500 font-mono">{t.canonDesc}</p>
                </div>
            </div>
            
            <div className="space-y-8">
                 {/* Prophetic Arcs (The Macro) */}
                {data.cross_references && data.cross_references.length > 0 && (
                    <PropheticArcs 
                      data={data.cross_references} 
                      language={language} 
                      onSelectArc={handleArcSelect}
                    />
                )}

                {/* Pattern Cluster Analysis (The Micro) */}
                <PatternCluster 
                    citations={data.citations} 
                    crossReferences={data.cross_references} 
                    language={language} 
                    filterRefs={selectedArc}
                />
            </div>
        </div>
      )}

      {/* Etymological Spectrometry */}
      {data.etymology && (
        <div className="my-8">
          <EtymologicalPrism data={data.etymology} language={language} />
        </div>
      )}

      {/* Chrono-Spatial 4D Reconstruction */}
      {data.chrono_spatial && data.chrono_spatial.eras && data.chrono_spatial.eras.length > 0 && (
         <div className="my-8">
           <ChronoMap data={data.chrono_spatial} language={language} />
         </div>
      )}

      {/* Historical Timeline */}
      {data.timeline && data.timeline.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 mb-6 text-amber-800">
            <History className="w-5 h-5" />
            <h3 className="text-xl font-serif font-bold">{t.timeline}</h3>
          </div>
          <TimelineChart events={data.timeline} />
        </div>
      )}

      {/* Bio-Genetic Sequencer */}
      {data.bio_theology && (
        <div className="my-8">
           <BioGeneticAnalysis data={data.bio_theology} language={language} />
        </div>
      )}

      {/* Algorithmic Analysis */}
      {data.algorithmic_analysis && (
        <div className="my-8">
           <BiblicalAlgorithm data={data.algorithmic_analysis} language={language} />
        </div>
      )}

      {/* Geographical Map */}
      {data.locations && data.locations.length > 0 && (
        <BiblicalMap locations={data.locations} language={language} />
      )}

      {/* Scripture DNA Visualization */}
      {data.cross_references && data.cross_references.length > 0 && (
        <ScriptureDNA references={data.cross_references} language={language} />
      )}

      {/* Scripture Distribution */}
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
           <div className="flex items-center gap-2 mb-6 text-indigo-800">
            <FileText className="w-5 h-5" />
            <h3 className="text-lg font-serif font-bold">{t.footprint}</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">{t.distDesc}</p>
          <DistributionChart citations={data.citations} language={language} />
        </div>
      </div>

      {/* Network Graph */}
      {crossReferenceRelationships.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 mb-2 text-indigo-900">
            <Network className="w-5 h-5" />
            <h3 className="text-lg font-serif font-bold">{t.interconnections}</h3>
          </div>
          <p className="text-sm text-gray-500 mb-6">{t.interDesc}</p>
          <NetworkGraph relationships={crossReferenceRelationships} height={500} language={language} />
          <div className="mt-2 text-xs text-center text-gray-400 italic">{t.hoverHint}</div>
        </div>
      )}

      {/* Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Themes Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 mb-6 text-indigo-800">
            <Activity className="w-5 h-5" />
            <h3 className="text-lg font-serif font-bold">{t.resonance}</h3>
          </div>
          <ThemeChart data={data.themes} language={language} />
        </div>

        {/* Relationship Network */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 mb-6 text-indigo-800">
            <Share2 className="w-5 h-5" />
            <h3 className="text-lg font-serif font-bold">{t.figures}</h3>
          </div>
          <NetworkGraph 
            relationships={data.relationships} 
            language={language} 
            nodeDetails={data.key_figures}
          />
        </div>
      </div>

      {/* Citations List */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="bg-stone-100 p-4 border-b border-stone-200 flex items-center gap-2">
          <Anchor className="w-5 h-5 text-stone-600" />
          <h3 className="text-lg font-serif font-bold text-stone-700">{t.citations}</h3>
        </div>
        <div className="divide-y divide-stone-100">
          {data.citations.map((cite, idx) => (
            <div key={idx} className="p-6 hover:bg-stone-50 transition-colors group">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-bold text-indigo-700 font-serif text-lg group-hover:underline decoration-indigo-300 underline-offset-4 transition-all">
                  {cite.book} {cite.chapter}:{cite.verse_start}{cite.verse_end ? `-${cite.verse_end}` : ''}
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-wider border border-gray-200 px-1.5 py-0.5 rounded">{t.verified}</span>
              </div>
              <p className="text-gray-800 font-serif italic mb-3 text-lg leading-relaxed text-stone-700 bg-stone-50/50 p-3 rounded-lg border-l-4 border-amber-400 shadow-sm">
                "{cite.text}"
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-600">{t.relevance}: </span>
                {cite.relevance}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
