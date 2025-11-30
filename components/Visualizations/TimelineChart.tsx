import React from 'react';
import { TimelineEvent } from '../../types';

interface TimelineChartProps {
  events: TimelineEvent[];
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ events }) => {
  if (!events || events.length === 0) return null;

  return (
    <div className="relative py-8">
      {/* Central Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-indigo-200 transform md:-translate-x-1/2"></div>

      <div className="space-y-12">
        {events.map((item, index) => (
          <div key={index} className={`relative flex items-center justify-between md:justify-normal ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
            
            {/* Dot on Line */}
            <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-indigo-600 rounded-full border-4 border-white shadow transform -translate-x-1/2 md:translate-x-[-50%] z-10"></div>

            {/* Content Content - Right on Mobile, Alternating on Desktop */}
            <div className={`w-full pl-12 md:pl-0 md:w-5/12 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 relative hover:shadow-md transition-shadow group">
                <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded mb-2 font-serif">
                  {item.year}
                </span>
                <h4 className="text-lg font-serif font-bold text-indigo-900 mb-1 group-hover:text-indigo-700 transition-colors">{item.event}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Empty Spacer for desktop layout balance */}
            <div className="hidden md:block md:w-5/12"></div>
            
          </div>
        ))}
      </div>
    </div>
  );
};