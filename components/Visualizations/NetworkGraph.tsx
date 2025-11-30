import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Relationship } from '../../types';

interface NetworkGraphProps {
  relationships: Relationship[];
  width?: number;
  height?: number;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ relationships, height = 400 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!relationships || relationships.length === 0 || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const w = containerRef.current.clientWidth;
    const h = height;
    
    svg.attr("width", w).attr("height", h);

    // Process nodes and links
    const nodesSet = new Set<string>();
    const typesSet = new Set<string>();

    relationships.forEach(r => {
      nodesSet.add(r.source);
      nodesSet.add(r.target);
      typesSet.add(r.type);
    });

    const nodes = Array.from(nodesSet).map(id => ({ id }));
    const links = relationships.map(r => ({ 
      source: r.source, 
      target: r.target, 
      type: r.type, 
      strength: r.strength,
      description: r.description 
    }));

    // Color Scale for Relationship Types
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(Array.from(typesSet));

    // Simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collide", d3.forceCollide().radius(35));

    // Arrow markers for each type color
    const defs = svg.append("defs");
    Array.from(typesSet).forEach(type => {
      const sanitizedType = type.replace(/\s+/g, '-').toLowerCase();
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

    // Fallback default arrow
    defs.append("marker")
      .attr("id", "arrow-default")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#9ca3af");

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
      .selectAll("path") // Using path for potential curves
      .data(links)
      .join("path")
      .attr("stroke", d => colorScale(d.type) as string)
      .attr("stroke-width", d => Math.max(1.5, d.strength / 2))
      .attr("fill", "none")
      .attr("marker-end", d => {
        const sanitizedType = d.type.replace(/\s+/g, '-').toLowerCase();
        return `url(#arrow-${sanitizedType})`;
      })
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).attr("stroke-width", 4);
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = "1";
          tooltipRef.current.style.left = `${event.pageX + 10}px`;
          tooltipRef.current.style.top = `${event.pageY + 10}px`;
          tooltipRef.current.innerHTML = `<strong>${d.type}</strong><br/>${d.description || ''}`;
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

  }, [relationships, height]);

  if (!relationships || relationships.length === 0) return <div className="h-64 flex items-center justify-center text-gray-400">No relationship data found.</div>;

  return (
    <>
      <div ref={containerRef} className="w-full border rounded-lg overflow-hidden bg-slate-50 cursor-grab active:cursor-grabbing relative">
         <svg ref={svgRef} className="w-full" style={{minHeight: height}} />
      </div>
      <div 
        ref={tooltipRef}
        className="fixed pointer-events-none bg-black/80 text-white text-xs p-2 rounded z-50 transition-opacity opacity-0 max-w-xs"
        style={{backdropFilter: 'blur(4px)'}}
      />
    </>
  );
};