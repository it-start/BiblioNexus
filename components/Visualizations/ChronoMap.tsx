
import React, { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import { ChronoSpatialAnalysis, AppLanguage } from '../../types';
import { History, Layers, MapPin, ChevronRight, Clock } from 'lucide-react';

/**
 * Props for the ChronoMap component.
 * @property data - The chrono-spatial analysis data to be visualized.
 * @property language - The language to be used for the component's text.
 */
interface ChronoMapProps {
  data: ChronoSpatialAnalysis;
  language?: AppLanguage;
}

/**
 * A component that visualizes the evolution of a location through time.
 *
 * @param data - The chrono-spatial analysis data to be visualized.
 * @param language - The language to be used for the component's text.
 * @returns A React component that renders an interactive map with a timeline.
 */
export const ChronoMap: React.FC<ChronoMapProps> = ({ data, language = AppLanguage.ENGLISH }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const layersRef = useRef<L.Layer[]>([]);
  const [currentEraIndex, setCurrentEraIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const t = {
    title: language === AppLanguage.RUSSIAN ? "Хроно-Пространственная Реконструкция (4D)" : "Chrono-Spatial Reconstruction (4D)",
    subtitle: language === AppLanguage.RUSSIAN ? "Эволюция локации во времени" : "Location evolution through time",
    keyStructures: language === AppLanguage.RUSSIAN ? "Ключевые структуры" : "Key Structures",
    cityBounds: language === AppLanguage.RUSSIAN ? "Границы города" : "City Bounds",
  };

  const handleEraChange = (index: number) => {
    if (index === currentEraIndex) return;
    setIsAnimating(true);
    setCurrentEraIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    if (!mapContainer.current || !data.eras || data.eras.length === 0) return;

    // Initialize map
    if (!mapInstance.current) {
      const initialCenter = data.eras[0].city_center;
      mapInstance.current = L.map(mapContainer.current, {
        zoomControl: false, // Reposition zoom later if needed
        attributionControl: false
      }).setView([initialCenter.lat, initialCenter.lng], 14);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(mapInstance.current);
      
      L.control.attribution({ prefix: false }).addTo(mapInstance.current);
    }

    const map = mapInstance.current;
    
    // Clear previous layers
    layersRef.current.forEach(layer => map.removeLayer(layer));
    layersRef.current = [];

    const era = data.eras[currentEraIndex];
    if (!era) return;

    // 1. Draw City Bounds (Walls)
    // Dynamic color based on era index to simulate "age"
    const eraColors = ['#d97706', '#b91c1c', '#7e22ce', '#1d4ed8']; 
    const color = eraColors[currentEraIndex % eraColors.length];

    const cityCircle = L.circle([era.city_center.lat, era.city_center.lng], {
      color: color,
      fillColor: color,
      fillOpacity: 0.1,
      radius: era.city_radius,
      weight: 2,
      dashArray: '4, 4'
    }).addTo(map);
    layersRef.current.push(cityCircle);

    // 2. Draw Features (Structures)
    const customIcon = L.divIcon({
      className: 'custom-structure-icon',
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 2px; transform: rotate(45deg); border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });

    era.features.forEach(feature => {
      const marker = L.marker([feature.latitude, feature.longitude], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div class="font-sans min-w-[200px]">
             <h4 class="font-bold text-indigo-900 border-b border-gray-100 pb-1 mb-1">${feature.name}</h4>
             <span class="text-[10px] uppercase tracking-wide bg-stone-100 px-1 rounded text-stone-500">${feature.type}</span>
             <p class="text-sm text-gray-600 mt-2 leading-snug">${feature.description}</p>
          </div>
        `);
      layersRef.current.push(marker);
    });

    // Animate Pan to new center
    map.flyTo([era.city_center.lat, era.city_center.lng], 14, { 
      duration: 1.5,
      easeLinearity: 0.25
    });

  }, [currentEraIndex, data, language]);

  if (!data.eras || data.eras.length === 0) return null;

  const currentEra = data.eras[currentEraIndex];
  const activeColor = ['text-amber-600 border-amber-200 bg-amber-50', 'text-red-600 border-red-200 bg-red-50', 'text-purple-600 border-purple-200 bg-purple-50', 'text-blue-600 border-blue-200 bg-blue-50'][currentEraIndex % 4];

  return (
    <div className="bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden flex flex-col h-[700px]">
      {/* Header */}
      <div className="bg-slate-900 p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-300">
            <History size={20} />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-white tracking-wide">{t.title}</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin size={10} /> {data.location_name}
            </p>
          </div>
        </div>
        
        {/* Era Counter Badge */}
        <div className="bg-slate-800 px-3 py-1 rounded-full text-xs font-mono text-slate-300 border border-slate-700">
           {currentEraIndex + 1} / {data.eras.length}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        
        {/* Map View Area */}
        <div className="relative flex-1 bg-stone-100 min-h-[300px] lg:h-full">
          <div ref={mapContainer} className="w-full h-full z-0" />
          
          {/* Timeline Stepper Overlay */}
          <div className="absolute bottom-6 left-4 right-4 z-[400]">
            <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl border border-stone-200 shadow-lg flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar">
               {data.eras.map((era, idx) => {
                 const isActive = idx === currentEraIndex;
                 return (
                   <button
                     key={idx}
                     onClick={() => handleEraChange(idx)}
                     className={`flex-1 min-w-[100px] px-3 py-2 rounded-lg transition-all duration-300 flex flex-col items-center gap-1 group ${
                       isActive 
                         ? 'bg-indigo-600 text-white shadow-md transform scale-105' 
                         : 'hover:bg-stone-100 text-stone-500'
                     }`}
                   >
                     <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-indigo-200' : 'text-stone-400'}`}>
                       {era.year_range}
                     </span>
                     <span className="text-xs font-serif font-semibold whitespace-nowrap truncate max-w-full">
                       {era.era_name}
                     </span>
                     {isActive && <div className="w-1 h-1 bg-white rounded-full mt-1 animate-pulse" />}
                   </button>
                 )
               })}
            </div>
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div className="w-full lg:w-96 bg-white border-l border-stone-200 flex flex-col shrink-0 z-10 shadow-[-5px_0_15px_rgba(0,0,0,0.02)]">
           
           {/* Sidebar Header (Fixed) */}
           <div className={`p-6 border-b transition-colors duration-500 ${activeColor.split(' ')[2]}`}>
             <div className="flex items-center gap-2 mb-2 opacity-80">
               <Clock size={14} />
               <span className="text-xs font-bold font-mono uppercase">{currentEra.year_range}</span>
             </div>
             <h2 className="text-2xl font-serif font-bold text-gray-900 leading-tight">
               {currentEra.era_name}
             </h2>
           </div>

           {/* Scrollable Content */}
           <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-stone-200">
             
             {/* Description with Fade Animation */}
             <div className={`mb-8 transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
               <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-stone-300 pl-4">
                 "{currentEra.description}"
               </p>
             </div>

             {/* Structures List */}
             <div>
               <h4 className="flex items-center gap-2 font-bold text-stone-400 uppercase text-xs tracking-wider mb-4">
                 <Layers size={14} /> {t.keyStructures}
               </h4>
               <div className="space-y-3">
                 {currentEra.features.map((feature, idx) => (
                   <div 
                     key={idx} 
                     className={`p-3 rounded-lg border bg-white shadow-sm transition-all duration-300 ${isAnimating ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}`}
                     style={{ transitionDelay: `${idx * 100}ms` }}
                   >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-indigo-900 text-sm font-serif">{feature.name}</span>
                        <ChevronRight size={14} className="text-stone-300" />
                      </div>
                      <div className="text-[10px] bg-stone-100 inline-block px-1.5 py-0.5 rounded text-stone-500 mb-2 font-medium">
                        {feature.type}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{feature.description}</p>
                   </div>
                 ))}
               </div>
             </div>
           </div>
           
           {/* Footer Hint */}
           <div className="p-3 border-t border-stone-100 bg-stone-50 text-[10px] text-center text-stone-400 uppercase tracking-widest">
              4D Reconstruction • Leaflet Integration
           </div>

        </div>
      </div>
    </div>
  );
};
