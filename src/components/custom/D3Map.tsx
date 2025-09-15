"use client";

import * as React from "react";
import * as d3 from "d3";
import { PALETTE_COLORS } from "@/constants";

type D3MapProps = {
  /** Dataset points in the format [[i, [x, y]], ...] */
  data: [number, [number, number]][];
  mode?: "move" | "paint";
  pointGroups?: (number | null)[];
  onSelectionChange?: (ids: number[]) => void;
  flipX?: boolean;
  flipY?: boolean;
};

export const D3Map: React.FC<D3MapProps> = ({
  data,
  mode = "move",
  pointGroups = [],
  onSelectionChange,
  flipX,
  flipY,
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const containerRef = React.useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const lassoRectRef = React.useRef<SVGRectElement | null>(null);
  const modeRef = React.useRef(mode);
  React.useEffect(() => { modeRef.current = mode; }, [mode]);

  const BASE_RADIUS = 1 * (window.devicePixelRatio || 1);

  // INITIALIZATION & DRAW POINTS: runs on data or flip change
  React.useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight;
    const margin = 20;

    svg.attr("width", width).attr("height", height);

    // create container if it doesn't exist
    if (!containerRef.current) {
      const container = svg.append("g");
      containerRef.current = container;
    }
    const container = containerRef.current;

    // compute extents
    const xExtent = d3.extent(data, ([, [x]]) => x)! as [number, number];
    const yExtent = d3.extent(data, ([, [, y]]) => y)! as [number, number];

    // build points array with flips applied
    const points = data.map(([i, [x, y]]) => ({
      i,
      x: flipX ? xExtent[1] - (x - xExtent[0]) : x,
      y: flipY ? yExtent[1] - (y - yExtent[0]) : y,
    }));

    // compute scales
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

    (container as any).xScale = xScale;
    (container as any).yScale = yScale;

    // DATA JOIN: update existing circles or add new ones
    const circles = container.selectAll<SVGCircleElement, typeof points[0]>("circle")
      .data(points, (d: any) => d.i);

    // UPDATE existing
    circles
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", BASE_RADIUS)
      .attr("fill", (d, i) =>
        pointGroups[i] != null
          ? PALETTE_COLORS[pointGroups[i]! % PALETTE_COLORS.length]
          : "black"
      );

    // ENTER new
    circles.enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", BASE_RADIUS)
      .attr("fill", (d, i) =>
        pointGroups[i] != null
          ? PALETTE_COLORS[pointGroups[i]! % PALETTE_COLORS.length]
          : "black"
      )
      .attr("opacity", 0.7);

    // EXIT removed
    circles.exit().remove();

    // Zoom setup (run once)
    if (!svg.select<SVGGElement>(".zoom-layer").node()) {
      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 15])
        .filter((event) => {
          if (event.type === "wheel") return true;
          if (event.type.startsWith("touch")) {
            const touches = event.touches?.length ?? 0;
            return touches === 1 ? modeRef.current === "move" : touches >= 2;
          }
          return modeRef.current === "move";
        })
        .on("zoom", (event) => {
          container.attr("transform", event.transform);
          container.selectAll("circle").attr("r", BASE_RADIUS / event.transform.k);
        });

      svg.call(zoom);
      svg.call(zoom.transform, d3.zoomIdentity);
    }

  }, [data, flipX, flipY, pointGroups]);


  // LASSO PAINTING
  React.useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    const svg = d3.select(svgRef.current);
    const container = containerRef.current;

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
        lassoPath = svg.append("path")
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

        if (onSelectionChange) onSelectionChange(selected.map((d: any) => d.i));

        if (lassoPath) { lassoPath.remove(); lassoPath = null; }
        coords = [];
      }

      lassoRectRef.current = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "transparent")
        .style("cursor", "crosshair")
        .node();

      d3.select(lassoRectRef.current).call(
        d3.drag<SVGRectElement, unknown>()
          .filter((event) => (event.sourceEvent?.touches?.length ?? 0) <= 1)
          .on("start", lassoStart)
          .on("drag", lassoDrag)
          .on("end", lassoEnd)
      )
      .on("touchstart.zoom", null)
      .on("touchmove.zoom", null)
      .on("touchend.zoom", null);
    }
  }, [mode, onSelectionChange]);

  // UPDATE colors when pointGroups change
  React.useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.selectAll("circle")
      .attr("fill", (d, i) =>
        pointGroups[i] != null
          ? PALETTE_COLORS[pointGroups[i]! % PALETTE_COLORS.length]
          : "black"
      );
  }, [pointGroups]);

  function pointInPolygon([x, y]: [number, number], vs: [number, number][]) {
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const [xi, yi] = vs[i], [xj, yj] = vs[j];
      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  return <svg ref={svgRef} className="w-screen h-screen block bg-gray-100" />;
};
