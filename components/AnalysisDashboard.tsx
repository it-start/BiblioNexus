
import React from 'react';
import { AnalysisData, Relationship, AppLanguage } from '../types';
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
import { PeerReviewPanel } from './PeerReviewPanel';
import { BookOpen, Share2, Activity, Info, Anchor, FileText, Network, History } from 'lucide-react';

interface AnalysisDashboardProps {
  data: AnalysisData;
  language?: AppLanguage;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data, language = AppLanguage.ENGLISH }) => {
  
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
    relevance: language === AppLanguage.RUSSIAN ? "Значение" : "Relevance"
  };

  // Transform cross_references to Relationship format for graph visualization
  const crossReferenceRelationships: Relationship[] = data.cross_references?.map(ref => ({
    source: ref.primary_verse,
    target: ref.related_verse,
    type: ref.connection_type,
    strength: 5, // Default strength
    description: ref.description
  })) || [];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* Top Section: Summary & Context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary Card */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 mb-4 text-indigo-800">
            <BookOpen className="w-5 h-5" />
            <h2 className="text-xl font-serif font-bold">{t.summary}</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg font-light">
            {data.summary}
          </p>
        </div>

        {/* Historical Context */}
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

      {/* Peer Review Panel (Truth Finding) */}
      {data.peer_review && (
        <div className="my-8">
          <PeerReviewPanel review={data.peer_review} language={language} />
        </div>
      )}

      {/* Deep Insight */}
      <div className="bg-indigo-50 p-8 rounded-xl border border-indigo-100">
        <h3 className="text-xl font-serif font-bold text-indigo-900 mb-4">{t.insight}</h3>
        <p className="text-indigo-900/80 leading-relaxed font-serif text-lg">
          {data.theological_insight}
        </p>
      </div>

      {/* Etymological Spectrometry (Source Code Analysis) - NEW */}
      {data.etymology && (
        <div className="my-8">
          <EtymologicalPrism data={data.etymology} language={language} />
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

      {/* Prophetic Arcs (Divine Trajectory) */}
      {data.cross_references && data.cross_references.length > 0 && (
        <div className="my-8">
          <PropheticArcs data={data.cross_references} language={language} />
        </div>
      )}

      {/* Bio-Genetic Sequencer (Bible as DNA) */}
      {data.bio_theology && (
        <div className="my-8">
           <BioGeneticAnalysis data={data.bio_theology} language={language} />
        </div>
      )}

      {/* Algorithmic Analysis (Bible as Code) */}
      {data.algorithmic_analysis && (
        <div className="my-8">
           <BiblicalAlgorithm data={data.algorithmic_analysis} language={language} />
        </div>
      )}

      {/* Geographical Map */}
      {data.locations && data.locations.length > 0 && (
        <BiblicalMap locations={data.locations} language={language} />
      )}

      {/* Pattern Cluster Analysis (Repetitive Logic) */}
      <div className="my-8">
         <PatternCluster 
           citations={data.citations} 
           crossReferences={data.cross_references} 
           language={language} 
         />
      </div>

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

      {/* Network Graph for Interconnections */}
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

        {/* Relationship Network (People) */}
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

      {/* Citations List (Strict) */}
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
