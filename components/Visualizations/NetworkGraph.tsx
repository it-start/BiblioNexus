import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Relationship } from '../../types';

interface NetworkGraphProps {
  relationships: Relationship[];
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ relationships }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!relationships || relationships.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = svgRef.current.clientWidth;
    const height = 300;

    // Process nodes and links
    const nodesSet = new Set<string>();
    relationships.forEach(r => {
      nodesSet.add(r.source);
      nodesSet.add(r.target);
    });

    const nodes = Array.from(nodesSet).map(id => ({ id }));
    const links = relationships.map(r => ({ source: r.source, target: r.target, type: r.type }));

    // Simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(30));

    // Render lines
    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5);

    // Render nodes
    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 8)
      .attr("fill", "#6366f1") // Indigo-500
      .call(drag(simulation) as any);

    // Labels
    const labels = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.id)
      .attr("font-size", 10)
      .attr("dx", 12)
      .attr("dy", 4)
      .attr("fill", "#374151");

    // Simulation Tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      labels
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
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
    <div className="w-full border rounded-lg overflow-hidden bg-slate-50">
       <svg ref={svgRef} className="w-full h-[300px]" />
    </div>
  );
};