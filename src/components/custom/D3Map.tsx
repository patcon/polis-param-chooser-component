"use client";

import * as React from "react";
import * as d3 from "d3";
import { PALETTE_COLORS } from "@/constants";

const FEATURE_SCALE_RADIUS_ON_ZOOM = true;

type D3MapProps = {
  /** Dataset points in the format [[i, [x, y]], ...] */
  data: [number, [number, number]][];
  mode?: "move" | "paint";
  /** Color indices parallel to data: null = default color, number = palette index */
  pointColors?: (number | null)[];
  /** Color palette to use for rendering points */
  palette?: string[];
  onSelectionChange?: (ids: (number | string)[]) => void;
  /** Called when exactly one point is clicked/tapped. Return false to allow event propagation. */
  onQuickSelect?: (id: number) => boolean | void;
  flipX?: boolean;
  flipY?: boolean;
};

export const D3Map: React.FC<D3MapProps> = ({
  data,
  mode = "move",
  pointColors = [],
  palette = PALETTE_COLORS,
  onSelectionChange,
  onQuickSelect,
  flipX,
  flipY,
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const containerRef = React.useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const lassoRectRef = React.useRef<SVGRectElement | null>(null);
  const modeRef = React.useRef(mode);
  React.useEffect(() => { modeRef.current = mode; }, [mode]);

  const BASE_RADIUS = 1 * (window.devicePixelRatio || 1);

  // --- Prepare points and scales ---
  const { points, xScale, yScale } = React.useMemo(() => {
    const xExtent = d3.extent(data, ([, [x]]) => x)! as [number, number];
    const yExtent = d3.extent(data, ([, [, y]]) => y)! as [number, number];

    const points = data.map(([i, [x, y]]) => ({
      i,
      x: flipX ? xExtent[1] - (x - xExtent[0]) : x,
      y: flipY ? yExtent[1] - (y - yExtent[0]) : y,
    }));

    const width = window.innerWidth;
    const height = window.innerHeight;
    const margin = 20;

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

    return { points, xScale, yScale };
  }, [data, flipX, flipY]);

  const quadtree = React.useMemo(
    () => d3.quadtree(points, d => d.x, d => d.y),
    [points]
  );

  // --- Initialize SVG & container ---
  React.useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.attr("width", window.innerWidth).attr("height", window.innerHeight);

    if (!containerRef.current) {
      containerRef.current = svg.append("g");
    }
  }, []);

  // --- Draw / update circles ---
  React.useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    (container as any).xScale = xScale;
    (container as any).yScale = yScale;

    const circles = container.selectAll<SVGCircleElement, typeof points[0]>("circle")
      .data(points, (d: any) => d.i);

    let transformK: any = null
    if (FEATURE_SCALE_RADIUS_ON_ZOOM) {
      const transform = d3.zoomTransform(svgRef.current!);
      transformK = transform.k;
    } else {
      transformK = 1;
    }

    // UPDATE
    circles
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", BASE_RADIUS / transformK)
      .attr("fill", (_, i) =>
        pointColors[i] != null
          ? palette[pointColors[i]! % palette.length]
          : "black"
      );

    // ENTER
    circles.enter()
      .append("circle")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", BASE_RADIUS / transformK)
      .attr("fill", (_, i) =>
        pointColors[i] != null
          ? palette[pointColors[i]! % palette.length]
          : "black"
      )
      .attr("opacity", 0.7);

    // EXIT
    circles.exit().remove();
  }, [points, xScale, yScale, pointColors, palette]);

  // --- Zoom behavior (pan/zoom only) ---
  React.useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    const svg = d3.select(svgRef.current);
    const container = containerRef.current;

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 15])
      .filter((event) => {
        /**
         * Here's what we do for every zoom event:
         * - all wheel events = YES, in any mode
         * - all multi-touch pinch events = YES, in any mode
         * - single-touch event = YES, in move mode
         * - otherwise, NO, ignore event, because we're painting.
         */
        if (event.type === "wheel") return true;
        if (event.type.startsWith("touch")) {
          const touches = event.touches?.length ?? 0;
          if (touches >= 2) return true; // pinch zoom
          if (touches === 1 && modeRef.current === "move") return true; // single-finger pan
          return false;
        }
        return modeRef.current === "move";
      })
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
        container.selectAll("circle").attr("r", BASE_RADIUS / (FEATURE_SCALE_RADIUS_ON_ZOOM ? event.transform.k : 1) );
      });

    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity);
  }, []);

  // --- Simple click/tap detection for quick select (works in both modes) ---
  React.useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    const svg = d3.select(svgRef.current);

    let startPos: [number, number] | null = null;
    let startTime = 0;

    const handlePointerDown = (event: PointerEvent) => {
      startPos = [event.clientX, event.clientY];
      startTime = Date.now();
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (!startPos) return;

      const dx = event.clientX - startPos[0];
      const dy = event.clientY - startPos[1];
      const distance = Math.sqrt(dx * dx + dy * dy);
      const duration = Date.now() - startTime;

      // Consider it a click/tap if movement is small and duration is short
      const isClick = distance < 10 && duration < 500;

      if (isClick) {
        console.log('🎯 Click/tap detected - mode:', mode);

        const [sx, sy] = d3.pointer(event, svg.node()!);
        const transform = d3.zoomTransform(containerRef.current!.node()!);
        const x = xScale.invert(transform.invertX(sx));
        const y = yScale.invert(transform.invertY(sy));
        const radius = xScale.invert(5) - xScale.invert(0);
        const p = quadtree.find(x, y, radius);

        if (p) {
          console.log('🎯 Quick select found point:', p.i);

          // Call the quick select callback
          const shouldPreventDefault = onQuickSelect?.(p.i);

          // Only prevent default if quick select was processed
          if (shouldPreventDefault !== false) {
            onSelectionChange?.([]);
            event.preventDefault();
            event.stopPropagation();
          }
        }
      }

      // Reset tracking
      startPos = null;
      startTime = 0;
    };

    const svgNode = svg.node();
    if (!svgNode) return;

    svgNode.addEventListener("pointerdown", handlePointerDown, true);
    svgNode.addEventListener("pointerup", handlePointerUp, true);

    return () => {
      svgNode.removeEventListener("pointerdown", handlePointerDown, true);
      svgNode.removeEventListener("pointerup", handlePointerUp, true);
    };
  }, [mode, xScale, yScale, quadtree, onSelectionChange, onQuickSelect]);

  // --- Lasso painting ---
  React.useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    const svg = d3.select(svgRef.current);
    const container = containerRef.current;

    // 🟢 Clean up any previous lasso drag when mode changes
    svg.on('.drag', null);

    if (lassoRectRef.current) {
      d3.select(lassoRectRef.current).remove();
      lassoRectRef.current = null;
    }

    if (mode === "paint") {
      let lassoPath: d3.Selection<SVGPathElement, unknown, null, undefined> | null = null;
      let coords: [number, number][] = [];

      function lassoStart(event: any) {
        console.log('🎨 Lasso START:', event.sourceEvent?.type);
        if (event.sourceEvent && (event.sourceEvent.touches?.length ?? 1) > 1) return;

        coords = [];
        if (lassoPath) lassoPath.remove();
        lassoPath = svg.append("path")
          .attr("fill", "rgba(0,0,0,0.1)")
          .attr("stroke", "#666")
          .attr("stroke-width", 1.5)
          .attr("stroke-dasharray", "4 2")
          .style("pointer-events", "none");
      }

      function lassoDrag(event: any) {
        console.log('🎨 Lasso DRAG:', event.sourceEvent?.type);
        if (event.sourceEvent && (event.sourceEvent.touches?.length ?? 1) > 1) return;
        coords.push([event.x, event.y]);
        if (lassoPath) lassoPath.attr("d", d3.line()(coords));
      }

      function lassoEnd() {
        console.log('🎨 Lasso END, coords:', coords.length);

        if (!coords.length) return;
        const transform = d3.zoomTransform(container.node()!);
        const circles = container.selectAll("circle");
        const selected = circles.data().filter((d: any) => {
          const sx = transform.applyX((container as any).xScale(d.x));
          const sy = transform.applyY((container as any).yScale(d.y));
          return pointInPolygon([sx, sy], coords);
        });
        if (onSelectionChange) onSelectionChange(selected.map((d: any) => d.i));

        if (lassoPath) { lassoPath.remove(); lassoPath = null; }
        coords = [];
      }

      console.log('🎨 Setting up lasso drag behavior');
      svg.call(
        d3.drag<SVGSVGElement, unknown>()
          .filter((event) => (event.sourceEvent?.touches?.length ?? 0) <= 1)
          .on("start", lassoStart)
          .on("drag", lassoDrag)
          .on("end", lassoEnd)
      );

      // To avoid type warning in case lassoRectRef is null
      if (!lassoRectRef.current) return;

      d3.select(lassoRectRef.current).call(
        // @ts-expect-error - Complex D3 drag behavior type issue, ignoring for now
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
  }, [mode, onSelectionChange, xScale, yScale]);

  // --- Update colors on pointColors or palette change ---
  React.useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.selectAll("circle")
      .attr("fill", (_, i) =>
        pointColors[i] != null
          ? palette[pointColors[i]! % palette.length]
          : "black"
      );
  }, [pointColors, palette]);

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
