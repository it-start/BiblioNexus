import React from 'react';
import { AnalysisData, Relationship } from '../types';
import { ThemeChart } from './Visualizations/ThemeChart';
import { NetworkGraph } from './Visualizations/NetworkGraph';
import { DistributionChart } from './Visualizations/DistributionChart';
import { TimelineChart } from './Visualizations/TimelineChart';
import { BookOpen, Share2, Activity, Info, Anchor, GitMerge, FileText, Network, History } from 'lucide-react';

interface AnalysisDashboardProps {
  data: AnalysisData;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data }) => {
  
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
            <h2 className="text-xl font-serif font-bold">Theological Summary</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg font-light">
            {data.summary}
          </p>
        </div>

        {/* Historical Context */}
        <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
          <div className="flex items-center gap-2 mb-4 text-amber-700">
            <Info className="w-5 h-5" />
            <h3 className="text-lg font-serif font-bold">Historical Context</h3>
          </div>
          <p className="text-sm text-gray-600 italic leading-relaxed">
            {data.historical_context}
          </p>
        </div>
      </div>

      {/* Historical Timeline */}
      {data.timeline && data.timeline.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 mb-6 text-amber-800">
            <History className="w-5 h-5" />
            <h3 className="text-xl font-serif font-bold">Timeline of Events</h3>
          </div>
          <TimelineChart events={data.timeline} />
        </div>
      )}

      {/* Deep Insight */}
      <div className="bg-indigo-50 p-8 rounded-xl border border-indigo-100">
        <h3 className="text-xl font-serif font-bold text-indigo-900 mb-4">Deep Theological Insight</h3>
        <p className="text-indigo-900/80 leading-relaxed font-serif text-lg">
          {data.theological_insight}
        </p>
      </div>

      {/* Scripture Distribution */}
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
           <div className="flex items-center gap-2 mb-6 text-indigo-800">
            <FileText className="w-5 h-5" />
            <h3 className="text-lg font-serif font-bold">Scriptural Footprint</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">Distribution of references across biblical books.</p>
          <DistributionChart citations={data.citations} />
        </div>
      </div>

      {/* Cross Reference Visualization (New) */}
      {crossReferenceRelationships.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 mb-2 text-indigo-900">
            <Network className="w-5 h-5" />
            <h3 className="text-lg font-serif font-bold">Scriptural Interconnections</h3>
          </div>
          <p className="text-sm text-gray-500 mb-6">Visualizing how scripture interprets scripture (e.g., Prophecy → Fulfillment).</p>
          <NetworkGraph relationships={crossReferenceRelationships} height={500} />
          <div className="mt-2 text-xs text-center text-gray-400 italic">Hover over connection lines to see connection details.</div>
        </div>
      )}

      {/* Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Themes Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 mb-6 text-indigo-800">
            <Activity className="w-5 h-5" />
            <h3 className="text-lg font-serif font-bold">Thematic Resonance</h3>
          </div>
          <ThemeChart data={data.themes} />
        </div>

        {/* Relationship Network (People) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 mb-6 text-indigo-800">
            <Share2 className="w-5 h-5" />
            <h3 className="text-lg font-serif font-bold">Key Figures Network</h3>
          </div>
          <NetworkGraph relationships={data.relationships} />
        </div>
      </div>

      {/* Cross References List */}
      {data.cross_references && data.cross_references.length > 0 && (
        <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6 text-indigo-900">
            <GitMerge className="w-5 h-5" />
            <h3 className="text-xl font-serif font-bold">Deep Cross-Reference Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.cross_references.map((ref, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                      {ref.connection_type}
                    </span>
                 </div>
                 <div className="flex items-center gap-3 mb-3">
                   <div className="font-serif font-bold text-gray-800">{ref.primary_verse}</div>
                   <div className="text-slate-300">→</div>
                   <div className="font-serif font-bold text-gray-800">{ref.related_verse}</div>
                 </div>
                 <p className="text-sm text-gray-600 italic">
                   "{ref.description}"
                 </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Citations List (Strict) */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="bg-stone-100 p-4 border-b border-stone-200 flex items-center gap-2">
          <Anchor className="w-5 h-5 text-stone-600" />
          <h3 className="text-lg font-serif font-bold text-stone-700">Verified Scriptural Citations</h3>
        </div>
        <div className="divide-y divide-stone-100">
          {data.citations.map((cite, idx) => (
            <div key={idx} className="p-6 hover:bg-stone-50 transition-colors group">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-bold text-indigo-700 font-serif text-lg group-hover:underline decoration-indigo-300 underline-offset-4 transition-all">
                  {cite.book} {cite.chapter}:{cite.verse_start}{cite.verse_end ? `-${cite.verse_end}` : ''}
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-wider border border-gray-200 px-1.5 py-0.5 rounded">Verified</span>
              </div>
              <p className="text-gray-800 font-serif italic mb-3 text-lg leading-relaxed text-stone-700 bg-stone-50/50 p-3 rounded-lg border-l-4 border-amber-400 shadow-sm">
                "{cite.text}"
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-600">Relevance: </span>
                {cite.relevance}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};