import React, { useState, useRef } from 'react';
import { TimelineEvent } from '../../types';
import { ZoomIn, ZoomOut, Maximize, Move } from 'lucide-react';

interface TimelineChartProps {
  events: TimelineEvent[];
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ events }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });

  if (!events || events.length === 0) return null;

  const updateScale = (delta: number) => {
    setScale(prev => Math.min(Math.max(0.5, prev + delta), 3));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const onMouseUp = () => setIsDragging(false);

  return (
    <div className="relative border border-stone-200 rounded-xl overflow-hidden bg-stone-50 h-[600px] shadow-inner select-none">
      
      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-md border border-stone-100">
        <button 
          onClick={() => updateScale(0.2)} 
          className="p-2 hover:bg-stone-100 rounded-md text-stone-600 transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
        <button 
          onClick={() => updateScale(-0.2)} 
          className="p-2 hover:bg-stone-100 rounded-md text-stone-600 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
        <button 
          onClick={handleReset} 
          className="p-2 hover:bg-stone-100 rounded-md text-stone-600 transition-colors"
          title="Reset View"
        >
           <Maximize size={20} />
        </button>
      </div>

      {/* Info Overlay */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-stone-500 pointer-events-none border border-stone-200 flex items-center gap-2 shadow-sm">
         <Move size={12} /> 
         <span>Drag to Pan</span>
         <span className="w-px h-3 bg-stone-300 mx-1"></span>
         <span>Zoom: {Math.round(scale * 100)}%</span>
      </div>

      {/* Viewport */}
      <div
        ref={containerRef}
        className={`w-full h-full cursor-${isDragging ? 'grabbing' : 'grab'} relative`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center top',
            transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
          className="w-full min-h-full p-8"
        >
          {/* Timeline Content */}
          <div className="relative max-w-4xl mx-auto py-12">
            
            {/* Central Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-indigo-200 transform md:-translate-x-1/2"></div>

            <div className="space-y-12">
              {events.map((item, index) => (
                <div key={index} className={`relative flex items-center justify-between md:justify-normal ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Dot on Line */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-indigo-600 rounded-full border-4 border-white shadow transform -translate-x-1/2 md:translate-x-[-50%] z-10"></div>

                  {/* Content - Right on Mobile, Alternating on Desktop */}
                  <div className={`w-full pl-12 md:pl-0 md:w-5/12 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-stone-200 relative hover:shadow-md transition-shadow group">
                      <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded mb-2 font-serif">
                        {item.year}
                      </span>
                      <h4 className="text-lg font-serif font-bold text-indigo-900 mb-2 group-hover:text-indigo-700 transition-colors">{item.event}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                      
                      {/* Connector Line (Decorative) */}
                      <div className={`hidden md:block absolute top-6 w-8 h-px bg-indigo-200 ${index % 2 === 0 ? '-right-8' : '-left-8'}`}></div>
                    </div>
                  </div>

                  {/* Empty Spacer for desktop layout balance */}
                  <div className="hidden md:block md:w-5/12"></div>
                  
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
