import React from 'react';
import { AnalysisData } from '../types';
import { ThemeChart } from './Visualizations/ThemeChart';
import { NetworkGraph } from './Visualizations/NetworkGraph';
import { BookOpen, Share2, Activity, Info } from 'lucide-react';

interface AnalysisDashboardProps {
  data: AnalysisData;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data }) => {
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

      {/* Deep Insight */}
      <div className="bg-indigo-50 p-8 rounded-xl border border-indigo-100">
        <h3 className="text-xl font-serif font-bold text-indigo-900 mb-4">Deep Insight</h3>
        <p className="text-indigo-900/80 leading-relaxed font-serif">
          {data.theological_insight}
        </p>
      </div>

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

        {/* Relationship Network */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 mb-6 text-indigo-800">
            <Share2 className="w-5 h-5" />
            <h3 className="text-lg font-serif font-bold">Connection Map</h3>
          </div>
          <NetworkGraph relationships={data.relationships} />
        </div>
      </div>

      {/* Citations List (Strict) */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="bg-stone-100 p-4 border-b border-stone-200">
          <h3 className="text-lg font-serif font-bold text-stone-700">Verified Scriptural Citations</h3>
        </div>
        <div className="divide-y divide-stone-100">
          {data.citations.map((cite, idx) => (
            <div key={idx} className="p-6 hover:bg-stone-50 transition-colors">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-bold text-indigo-700 font-serif text-lg">
                  {cite.book} {cite.chapter}:{cite.verse_start}{cite.verse_end ? `-${cite.verse_end}` : ''}
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Verified</span>
              </div>
              <p className="text-gray-800 font-serif italic mb-3 text-lg leading-relaxed text-stone-700 bg-stone-50/50 p-2 rounded-lg border-l-4 border-amber-400">
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