
import React, { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import { ChronoSpatialAnalysis, AppLanguage } from '../../types';
import { History, Play, SkipBack, SkipForward, Map as MapIcon, Layers } from 'lucide-react';

interface ChronoMapProps {
  data: ChronoSpatialAnalysis;
  language?: AppLanguage;
}

export const ChronoMap: React.FC<ChronoMapProps> = ({ data, language = AppLanguage.ENGLISH }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const layersRef = useRef<L.Layer[]>([]);
  const [currentEraIndex, setCurrentEraIndex] = useState(0);

  const t = {
    title: language === AppLanguage.RUSSIAN ? "Хроно-Пространственная Реконструкция (4D)" : "Chrono-Spatial Reconstruction (4D)",
    subtitle: language === AppLanguage.RUSSIAN ? "Эволюция локации во времени" : "Location evolution through time",
    era: language === AppLanguage.RUSSIAN ? "Эпоха" : "Era",
    keyStructures: language === AppLanguage.RUSSIAN ? "Ключевые структуры" : "Key Structures",
    cityBounds: language === AppLanguage.RUSSIAN ? "Границы города" : "City Bounds",
  };

  useEffect(() => {
    if (!mapContainer.current || !data.eras || data.eras.length === 0) return;

    // Initialize map
    if (!mapInstance.current) {
      const initialCenter = data.eras[0].city_center;
      mapInstance.current = L.map(mapContainer.current).setView([initialCenter.lat, initialCenter.lng], 14);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(mapInstance.current);
    }

    const map = mapInstance.current;
    
    // Clear previous layers
    layersRef.current.forEach(layer => map.removeLayer(layer));
    layersRef.current = [];

    const era = data.eras[currentEraIndex];
    if (!era) return;

    // 1. Draw City Bounds (Walls)
    // Dynamic color based on era index to simulate "age"
    const eraColors = ['#d97706', '#dc2626', '#7e22ce']; // Bronze (Amber), Iron (Red), Roman (Purple)
    const color = eraColors[currentEraIndex % eraColors.length];

    const cityCircle = L.circle([era.city_center.lat, era.city_center.lng], {
      color: color,
      fillColor: color,
      fillOpacity: 0.15,
      radius: era.city_radius,
      weight: 2,
      dashArray: '5, 5'
    }).addTo(map);
    
    cityCircle.bindTooltip(`${era.era_name} ${t.cityBounds}`, { permanent: false, direction: 'top' });
    layersRef.current.push(cityCircle);

    // 2. Draw Features (Structures)
    const customIcon = L.divIcon({
      className: 'custom-structure-icon',
      html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 2px; transform: rotate(45deg); border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    era.features.forEach(feature => {
      const marker = L.marker([feature.latitude, feature.longitude], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div class="font-sans">
             <h4 class="font-bold text-indigo-900">${feature.name}</h4>
             <span class="text-[10px] uppercase tracking-wide bg-stone-100 px-1 rounded text-stone-500">${feature.type}</span>
             <p class="text-sm text-gray-600 mt-1">${feature.description}</p>
          </div>
        `);
      layersRef.current.push(marker);
    });

    // Animate Pan to new center
    map.flyTo([era.city_center.lat, era.city_center.lng], 14, { duration: 1.5 });

  }, [currentEraIndex, data, language, t.cityBounds]);

  if (!data.eras || data.eras.length === 0) return null;

  const currentEra = data.eras[currentEraIndex];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="bg-amber-50 p-6 border-b border-amber-100 flex items-center gap-3">
        <div className="bg-amber-200 p-2 rounded-lg text-amber-900">
          <History size={24} />
        </div>
        <div>
          <h3 className="text-xl font-serif font-bold text-gray-900">{t.title}</h3>
          <p className="text-sm text-amber-800/70">{t.subtitle}: {data.location_name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 h-[500px]">
        {/* Map View */}
        <div className="lg:col-span-2 relative">
          <div ref={mapContainer} className="w-full h-full z-0" />
          
          {/* Overlay Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-stone-200 z-[400] flex items-center gap-4">
            <button 
              onClick={() => setCurrentEraIndex(Math.max(0, currentEraIndex - 1))}
              disabled={currentEraIndex === 0}
              className="p-1 rounded-full hover:bg-stone-100 disabled:opacity-30 transition-colors"
            >
              <SkipBack size={20} className="text-indigo-900" />
            </button>

            <div className="text-center min-w-[120px]">
               <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t.era} {currentEraIndex + 1}/{data.eras.length}</div>
               <div className="font-serif font-bold text-indigo-900 text-sm">{currentEra.year_range}</div>
            </div>

            <button 
              onClick={() => setCurrentEraIndex(Math.min(data.eras.length - 1, currentEraIndex + 1))}
              disabled={currentEraIndex === data.eras.length - 1}
              className="p-1 rounded-full hover:bg-stone-100 disabled:opacity-30 transition-colors"
            >
              <SkipForward size={20} className="text-indigo-900" />
            </button>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-stone-50 border-l border-stone-200 p-6 overflow-y-auto flex flex-col">
           <div className="mb-6">
             <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full mb-2">
               {currentEra.year_range}
             </div>
             <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 leading-tight">
               {currentEra.era_name}
             </h2>
             <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-amber-300 pl-4">
               "{currentEra.description}"
             </p>
           </div>

           <div>
             <h4 className="flex items-center gap-2 font-bold text-stone-500 uppercase text-xs tracking-wider mb-3">
               <Layers size={14} /> {t.keyStructures}
             </h4>
             <div className="space-y-3">
               {currentEra.features.map((feature, idx) => (
                 <div key={idx} className="bg-white p-3 rounded border border-stone-200 shadow-sm hover:border-indigo-300 transition-colors cursor-default">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-indigo-900 text-sm">{feature.name}</span>
                      <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-500">{feature.type}</span>
                    </div>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
