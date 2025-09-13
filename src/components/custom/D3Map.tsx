"use client";

import * as React from "react";
import * as d3 from "d3";
import "./D3Map.css";

type D3MapProps = {
  /** Dataset points in the format [[i, [x, y]], ...] */
  data: [number, [number, number]][];
  mode?: "move" | "paint";
  selectedIds?: number[];
  onSelectionChange?: (ids: number[]) => void;
};

export const D3Map: React.FC<D3MapProps> = ({
  data,
  mode = "move",
  selectedIds = [],
  onSelectionChange,
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const containerRef = React.useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const lassoRectRef = React.useRef<SVGRectElement | null>(null);

  // keep latest mode in ref for zoom filter
  const modeRef = React.useRef(mode);
  React.useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // INITIALIZATION: runs only once
  React.useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const margin = 20;
    const BASE_RADIUS = 1 * (window.devicePixelRatio || 1);

    const svg = d3.select(svgRef.current);
    svg.attr("width", width).attr("height", height);
    svg.selectAll("*").remove();

    const container = svg.append("g");
    containerRef.current = container;

    // prepare points and scaling
    const points = data.map(([i, [x, y]]) => ({ i, x, y }));
    const xExtent = d3.extent(points, (d) => d.x)! as [number, number];
    const yExtent = d3.extent(points, (d) => d.y)! as [number, number];

    const dataWidth = xExtent[1] - xExtent[0];
    const dataHeight = yExtent[1] - yExtent[0];
    const dataAspect = dataWidth / dataHeight;
    const screenWidth = width - 2 * margin;
    const screenHeight = height - 2 * margin;
    const screenAspect = screenWidth / screenHeight;

    let xRange: [number, number], yRange: [number, number];
    if (dataAspect > screenAspect) {
      const scaledHeight = screenWidth / dataAspect;
      const yOffset = (screenHeight - scaledHeight) / 2;
      xRange = [margin, width - margin];
      yRange = [height - margin - yOffset, margin + yOffset];
    } else {
      const scaledWidth = screenHeight * dataAspect;
      const xOffset = (screenWidth - scaledWidth) / 2;
      xRange = [margin + xOffset, width - margin - xOffset];
      yRange = [height - margin, margin];
    }

    const xScale = d3.scaleLinear().domain(xExtent).range(xRange);
    const yScale = d3.scaleLinear().domain(yExtent).range(yRange);

    // draw circles
    container
      .selectAll("circle")
      .data(points)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", BASE_RADIUS)
      .attr("fill", "steelblue")
      .attr("opacity", 0.7);

    // zoom behaviour (reads modeRef.current)
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 15])
      .filter((event) => {
        // wheel events always allowed
        if (event.type === "wheel") return true;

        // touch events
        if (event.type.startsWith("touch")) {
          if (mode === "move") return true; // allow single-finger pan in move mode
          // optionally allow pinch-to-zoom
          return event.touches && event.touches.length >= 2;
        }

        // mouse drag only in move mode
        return mode === "move";
      })
      .on("zoom", (event) => {
        const { k } = event.transform;
        container.attr("transform", event.transform);
        container.selectAll("circle").attr("r", BASE_RADIUS / k);
      });

    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity);

    // store scales for later use in lasso
    (containerRef.current as any).xScale = xScale;
    (containerRef.current as any).yScale = yScale;

    return () => {
      svg.selectAll("*").remove();
    };
  }, [data]);

  // DYNAMIC LASSO: activate only in paint mode
  React.useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    const svg = d3.select(svgRef.current);
    const container = containerRef.current;

    // remove previous lasso if any
    if (lassoRectRef.current) {
      d3.select(lassoRectRef.current).remove();
      lassoRectRef.current = null;
    }

    if (mode === "paint") {
      let lassoPath: d3.Selection<SVGPathElement, unknown, null, undefined> | null = null;
      let coords: [number, number][] = [];
      const width = window.innerWidth;
      const height = window.innerHeight;

      function lassoStart(event: any) {
        if (event.sourceEvent && (event.sourceEvent.touches?.length ?? 1) > 1) return;

        coords = [];
        if (lassoPath) lassoPath.remove();
        lassoPath = svg
          .append("path")
          .attr("fill", "rgba(0,0,0,0.1)")
          .attr("stroke", "#666")
          .attr("stroke-width", 1.5)
          .attr("stroke-dasharray", "4 2");
      }

      function lassoDrag(event: any) {
        if (event.sourceEvent && (event.sourceEvent.touches?.length ?? 1) > 1) return;

        coords.push([event.x, event.y]);
        if (lassoPath) lassoPath.attr("d", d3.line()(coords));
      }

      function lassoEnd() {
        if (!coords.length) return;
        const transform = d3.zoomTransform(container.node()!);
        const circles = container.selectAll("circle");
        const selected = circles.data().filter((d: any) => {
          const sx = transform.applyX((containerRef.current as any).xScale(d.x));
          const sy = transform.applyY((containerRef.current as any).yScale(d.y));
          return pointInPolygon([sx, sy], coords);
        });

        circles.classed("selected", (d: any) =>
          selected.some((s: any) => s.i === d.i)
        );
        if (onSelectionChange) onSelectionChange(selected.map((d: any) => d.i));
        if (lassoPath) {
          lassoPath.remove();
          lassoPath = null;
        }
        coords = [];
      }

      lassoRectRef.current = svg
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "transparent")
        .style("cursor", "crosshair")
        .node();

      d3.select(lassoRectRef.current).call(
        d3
          .drag<SVGRectElement, unknown>()
          .on("start", lassoStart)
          .on("drag", lassoDrag)
          .on("end", lassoEnd)
      );
    }
  }, [mode, onSelectionChange]);

  // UPDATE selected circles without resetting zoom
  React.useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.selectAll("circle").classed("selected", (d: any) =>
      selectedIds.includes(d.i)
    );
  }, [selectedIds]);

  function pointInPolygon([x, y]: [number, number], vs: [number, number][]) {
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const [xi, yi] = vs[i],
        [xj, yj] = vs[j];
      const intersect =
        yi > y !== yj > y &&
        x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  return <svg ref={svgRef} className="w-screen h-screen block bg-gray-100" />;
};
