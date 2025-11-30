import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Relationship, AppLanguage } from '../../types';
import { Filter, SlidersHorizontal, RefreshCcw } from 'lucide-react';

interface NetworkGraphProps {
  relationships: Relationship[];
  height?: number;
  language?: AppLanguage;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ relationships, height = 400, language = AppLanguage.ENGLISH }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const t = {
    connectionTypes: language === AppLanguage.RUSSIAN ? "Типы связей" : "Connection Types",
    reset: language === AppLanguage.RUSSIAN ? "Сброс" : "Reset",
    minStrength: language === AppLanguage.RUSSIAN ? "Мин. сила" : "Min Strength",
    weak: language === AppLanguage.RUSSIAN ? "Слабо" : "Weak",
    strong: language === AppLanguage.RUSSIAN ? "Сильно" : "Strong",
    noMatch: language === AppLanguage.RUSSIAN ? "Нет связей, соответствующих фильтрам." : "No connections match your filters.",
    clearFilters: language === AppLanguage.RUSSIAN ? "Очистить фильтры" : "Clear Filters",
    noData: language === AppLanguage.RUSSIAN ? "Данные о связях не найдены." : "No relationship data found.",
    strength: language === AppLanguage.RUSSIAN ? "Сила" : "Strength"
  };

  // Extract all unique types from the original data for the filter controls
  const allTypes = useMemo(() => {
    const types = new Set(relationships.map(r => r.type));
    return Array.from(types).sort();
  }, [relationships]);

  // State for filters
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [minStrength, setMinStrength] = useState<number>(1);
  
  // Initialize/Reset filters when data changes
  useEffect(() => {
    setSelectedTypes(new Set(relationships.map(r => r.type)));
    setMinStrength(1);
  }, [relationships]);

  // Derived filtered data
  const filteredRelationships = useMemo(() => {
    return relationships.filter(r => 
      selectedTypes.has(r.type) && r.strength >= minStrength
    );
  }, [relationships, selectedTypes, minStrength]);

  const toggleType = (type: string) => {
    const next = new Set(selectedTypes);
    if (next.has(type)) {
      next.delete(type);
    } else {
      next.add(type);
    }
    setSelectedTypes(next);
  };

  const resetFilters = () => {
    setSelectedTypes(new Set(allTypes));
    setMinStrength(1);
  };

  // D3 Rendering Logic
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Clear previous render
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // If no data after filtering, show simple message in container (handled in return, but clear svg here)
    if (filteredRelationships.length === 0) return;

    const w = containerRef.current.clientWidth;
    const h = height;
    
    svg.attr("width", w).attr("height", h);

    // Process nodes and links from FILTERED data
    const nodesSet = new Set<string>();
    const typesSet = new Set<string>(); // Used for markers

    filteredRelationships.forEach(r => {
      nodesSet.add(r.source);
      nodesSet.add(r.target);
      typesSet.add(r.type);
    });

    const nodes = Array.from(nodesSet).map(id => ({ id }));
    const links = filteredRelationships.map(r => ({ 
      source: r.source, 
      target: r.target, 
      type: r.type, 
      strength: r.strength,
      description: r.description 
    }));

    // Color Scale - use allTypes to ensure consistent colors even when filtered
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(allTypes);

    // Simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collide", d3.forceCollide().radius(35));

    // Arrow markers
    const defs = svg.append("defs");
    allTypes.forEach(type => {
      const sanitizedType = type.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      defs.append("marker")
        .attr("id", `arrow-${sanitizedType}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 25)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", colorScale(type) as string);
    });

    const g = svg.append("g");

    // Zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    
    svg.call(zoom as any);

    // Render links
    const linkGroup = g.append("g").attr("class", "links");
    const link = linkGroup
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("stroke", d => colorScale(d.type) as string)
      .attr("stroke-width", d => Math.max(1.5, d.strength / 2))
      .attr("fill", "none")
      .attr("marker-end", d => {
        const sanitizedType = d.type.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        return `url(#arrow-${sanitizedType})`;
      })
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).attr("stroke-width", 4);
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = "1";
          tooltipRef.current.style.left = `${event.pageX + 10}px`;
          tooltipRef.current.style.top = `${event.pageY + 10}px`;
          tooltipRef.current.innerHTML = `<strong>${d.type}</strong><br/>${d.description || ''}<br/><span style="font-size:0.8em; opacity:0.8">${t.strength}: ${d.strength}</span>`;
        }
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget).attr("stroke-width", Math.max(1.5, d.strength / 2));
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = "0";
        }
      });

    // Render nodes
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(drag(simulation) as any);

    // Node circles
    node.append("circle")
      .attr("r", 12)
      .attr("fill", "white")
      .attr("stroke", "#4f46e5") // Indigo-600
      .attr("stroke-width", 2)
      .on("mouseover", function() { d3.select(this).attr("fill", "#e0e7ff"); })
      .on("mouseout", function() { d3.select(this).attr("fill", "white"); });

    // Node labels
    node.append("text")
      .text(d => d.id)
      .attr("font-size", 10)
      .attr("font-weight", "600")
      .attr("dy", 24)
      .attr("text-anchor", "middle")
      .attr("fill", "#1e293b")
      .style("pointer-events", "none")
      .style("text-shadow", "0 1px 4px white");

    // Simulation Tick
    simulation.on("tick", () => {
      link.attr("d", (d: any) => {
        return `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`;
      });

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function drag(simulation: d3.Simulation<any, undefined>) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

  }, [filteredRelationships, height, allTypes, t.strength]);

  // Color helper for badges (using same D3 scheme logic)
  const getColor = (type: string) => {
    const scale = d3.scaleOrdinal(d3.schemeCategory10).domain(allTypes);
    return scale(type) as string;
  };

  if (!relationships || relationships.length === 0) return <div className="h-64 flex items-center justify-center text-gray-400">{t.noData}</div>;

  return (
    <div className="flex flex-col gap-4">
      {/* Filters UI */}
      <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 shadow-sm transition-all">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          
          {/* Types Filter */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Filter size={14} className="text-indigo-600" />
                <span>{t.connectionTypes}</span>
              </div>
              <button 
                onClick={resetFilters} 
                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                title="Reset all filters"
              >
                <RefreshCcw size={10} /> {t.reset}
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {allTypes.map(type => {
                const isActive = selectedTypes.has(type);
                const color = getColor(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-white shadow-sm ring-1 ring-black/5'
                        : 'bg-gray-100 border-transparent text-gray-400 grayscale'
                    }`}
                    style={{
                      borderColor: isActive ? color : 'transparent',
                      color: isActive ? '#374151' : undefined
                    }}
                  >
                    <span 
                      className={`w-2 h-2 rounded-full`} 
                      style={{ backgroundColor: isActive ? color : '#9ca3af' }}
                    />
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Strength Filter */}
          <div className="w-full md:w-56 shrink-0 border-t md:border-t-0 md:border-l border-stone-200 pt-4 md:pt-0 md:pl-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <SlidersHorizontal size={14} className="text-indigo-600" />
                <span>{t.minStrength}</span>
              </div>
              <span className="text-xs font-mono font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                {minStrength}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={minStrength}
              onChange={(e) => setMinStrength(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-sans uppercase tracking-wider">
              <span>{t.weak}</span>
              <span>{t.strong}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Graph Container */}
      <div className="relative">
        <div ref={containerRef} className="w-full border rounded-lg overflow-hidden bg-white cursor-grab active:cursor-grabbing relative" style={{ minHeight: height }}>
          {filteredRelationships.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2">
              <Filter size={32} className="opacity-20" />
              <p className="text-sm">{t.noMatch}</p>
              <button onClick={resetFilters} className="text-xs text-indigo-600 hover:underline mt-2">{t.clearFilters}</button>
            </div>
          ) : (
            <svg ref={svgRef} className="w-full block" />
          )}
        </div>
        <div 
          ref={tooltipRef}
          className="fixed pointer-events-none bg-black/80 text-white text-xs p-2 rounded z-50 transition-opacity opacity-0 max-w-xs shadow-xl border border-white/10"
          style={{backdropFilter: 'blur(4px)'}}
        />
      </div>
    </div>
  );
};
