import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Relationship } from '../../types';

interface NetworkGraphProps {
  relationships: Relationship[];
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ relationships }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!relationships || relationships.length === 0 || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = containerRef.current.clientWidth;
    const height = 400;
    
    svg.attr("width", width).attr("height", height);

    // Process nodes and links
    const nodesSet = new Set<string>();
    relationships.forEach(r => {
      nodesSet.add(r.source);
      nodesSet.add(r.target);
    });

    const nodes = Array.from(nodesSet).map(id => ({ id }));
    const links = relationships.map(r => ({ source: r.source, target: r.target, type: r.type, strength: r.strength }));

    // Simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(40));

    // Arrow marker
    svg.append("defs").selectAll("marker")
      .data(["end"])
      .enter().append("marker")
      .attr("id", "arrow")
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
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");

    // Link Labels
    const linkLabel = linkGroup
      .selectAll(".link-label")
      .data(links)
      .join("text")
      .attr("class", "link-label")
      .text(d => d.type)
      .attr("font-size", 9)
      .attr("fill", "#64748b")
      .attr("text-anchor", "middle")
      .style("background", "white"); // Basic style, background rect requires more complex SVG

    // Render nodes
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(drag(simulation) as any);

    // Node circles
    node.append("circle")
      .attr("r", 15)
      .attr("fill", "#e0e7ff")
      .attr("stroke", "#6366f1")
      .attr("stroke-width", 2)
      .on("mouseover", function() { d3.select(this).attr("fill", "#c7d2fe"); })
      .on("mouseout", function() { d3.select(this).attr("fill", "#e0e7ff"); });

    // Node labels
    node.append("text")
      .text(d => d.id)
      .attr("font-size", 12)
      .attr("font-weight", "600")
      .attr("dx", 20)
      .attr("dy", 5)
      .attr("fill", "#1e293b")
      .style("pointer-events", "none")
      .style("text-shadow", "0 1px 2px white");

    // Simulation Tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      
      linkLabel
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2 - 5);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
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

  }, [relationships]);

  if (!relationships || relationships.length === 0) return <div className="h-64 flex items-center justify-center text-gray-400">No relationship data found.</div>;

  return (
    <div ref={containerRef} className="w-full border rounded-lg overflow-hidden bg-slate-50 cursor-grab active:cursor-grabbing">
       <svg ref={svgRef} className="w-full h-[400px]" />
    </div>
  );
};