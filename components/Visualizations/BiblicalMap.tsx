import React, { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import { BiblicalLocation, AppLanguage } from '../../types';
import { Layers, MapPin, Users, Lightbulb } from 'lucide-react';

interface BiblicalMapProps {
  locations: BiblicalLocation[];
  language?: AppLanguage;
}

export const BiblicalMap: React.FC<BiblicalMapProps> = ({ locations, language = AppLanguage.ENGLISH }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [showFigures, setShowFigures] = useState(false);
  const [showThemes, setShowThemes] = useState(false);

  const t = {
    title: language === AppLanguage.RUSSIAN ? "Библейская карта" : "Biblical Map",
    overlayFigures: language === AppLanguage.RUSSIAN ? "Показать ключевые фигуры" : "Overlay Key Figures",
    overlayThemes: language === AppLanguage.RUSSIAN ? "Показать тематические связи" : "Overlay Thematic Connections",
    noData: language === AppLanguage.RUSSIAN ? "Нет геоданных для отображения." : "No geographical data available.",
    associatedFigures: language === AppLanguage.RUSSIAN ? "Связанные фигуры" : "Associated Figures",
    associatedThemes: language === AppLanguage.RUSSIAN ? "Связанные темы" : "Associated Themes",
  };

  useEffect(() => {
    if (!mapContainer.current || locations.length === 0) return;

    // Initialize map only once
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapContainer.current).setView([31.7683, 35.2137], 7); // Default to Jerusalem

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(mapInstance.current);
    }

    const map = mapInstance.current;
    
    // Clear existing layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Popup) {
        map.removeLayer(layer);
      }
    });

    const bounds = L.latLngBounds([]);

    // Custom Icon
    const createCustomIcon = (color: string) => {
      return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });
    };

    locations.forEach(loc => {
      if (loc.latitude && loc.longitude) {
        bounds.extend([loc.latitude, loc.longitude]);

        // Generate popup content based on filters
        let overlayContent = '';
        
        if (showFigures && loc.associated_figures && loc.associated_figures.length > 0) {
          overlayContent += `
            <div class="mt-2 pt-2 border-t border-gray-100">
              <strong class="text-xs text-indigo-700 block mb-1">${t.associatedFigures}:</strong>
              <div class="flex flex-wrap gap-1">
                ${loc.associated_figures.map(f => `<span class="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] rounded border border-indigo-100">${f}</span>`).join('')}
              </div>
            </div>
          `;
        }

        if (showThemes && loc.associated_themes && loc.associated_themes.length > 0) {
          overlayContent += `
            <div class="mt-2 pt-2 border-t border-gray-100">
              <strong class="text-xs text-amber-700 block mb-1">${t.associatedThemes}:</strong>
              <div class="flex flex-wrap gap-1">
                ${loc.associated_themes.map(th => `<span class="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] rounded border border-amber-100">${th}</span>`).join('')}
              </div>
            </div>
          `;
        }

        const popupContent = `
          <div class="font-sans min-w-[200px]">
            <h3 class="font-serif font-bold text-lg text-gray-900">${loc.name}</h3>
            <p class="text-xs text-gray-500 italic mb-2">${loc.significance}</p>
            <p class="text-sm text-gray-700 leading-relaxed">${loc.description}</p>
            ${overlayContent}
          </div>
        `;

        L.marker([loc.latitude, loc.longitude], { 
          icon: createCustomIcon('#4f46e5') 
        })
          .addTo(map)
          .bindPopup(popupContent);
      }
    });

    if (locations.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }

  }, [locations, showFigures, showThemes, language]);

  if (locations.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="flex items-center gap-2 text-indigo-900">
          <MapPin className="w-5 h-5" />
          <h3 className="text-xl font-serif font-bold">{t.title}</h3>
        </div>
        
        <div className="flex gap-3 text-sm">
           <button 
             onClick={() => setShowFigures(!showFigures)}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
               showFigures 
                 ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium' 
                 : 'bg-white border-stone-200 text-gray-500 hover:bg-stone-50'
             }`}
           >
             <Users size={14} />
             {t.overlayFigures}
           </button>
           <button 
             onClick={() => setShowThemes(!showThemes)}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
               showThemes
                 ? 'bg-amber-50 border-amber-200 text-amber-800 font-medium' 
                 : 'bg-white border-stone-200 text-gray-500 hover:bg-stone-50'
             }`}
           >
             <Lightbulb size={14} />
             {t.overlayThemes}
           </button>
        </div>
      </div>

      <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-stone-200 z-0">
         <div ref={mapContainer} className="w-full h-full" style={{ zIndex: 1 }} />
      </div>
      
      <div className="mt-2 text-xs text-gray-400 text-center flex items-center justify-center gap-1">
        <Layers size={10} />
        {language === AppLanguage.RUSSIAN 
          ? "Картографические данные © OpenStreetMap & CARTO" 
          : "Map data © OpenStreetMap & CARTO"
        }
      </div>
    </div>
  );
};