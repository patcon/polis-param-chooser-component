"use client";

import * as React from "react";
import * as d3 from "d3";

type D3MapProps = {
  /** Dataset points in the format [[i, [x, y]], ...] */
  data: [number, [number, number]][];
};

export const D3Map: React.FC<D3MapProps> = ({ data }) => {
  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight;
    const margin = 20;
    const BASE_RADIUS = 5 * (window.devicePixelRatio || 1);
    const BASE_LINE_WIDTH = 1 * (window.devicePixelRatio || 1);

    svg.attr("width", width).attr("height", height);
    const container = svg.append("g");

    let xScale: d3.ScaleLinear<number, number>;
    let yScale: d3.ScaleLinear<number, number>;
    let lassoPath: d3.Selection<SVGPathElement, unknown, null, undefined> | null = null;
    let coords: [number, number][] = [];
    let circles: d3.Selection<SVGCircleElement, { i: number; x: number; y: number }, SVGGElement, unknown>;

    function lassoStart(event: any) {
      coords = [];
      if (lassoPath) lassoPath.remove();
      lassoPath = svg.append("path").attr("class", "lasso");
    }

    function lassoDrag(event: any) {
      coords.push([event.x, event.y]);
      if (lassoPath) lassoPath.attr("d", d3.line()(coords));
    }

    function lassoEnd() {
      if (!coords.length) return;
      const transform = d3.zoomTransform(container.node()!);
      circles.classed("selected", (d) => {
        const sx = transform.applyX(xScale(d.x));
        const sy = transform.applyY(yScale(d.y));
        return pointInPolygon([sx, sy], coords);
      });
      if (lassoPath) {
        lassoPath.remove();
        lassoPath = null;
      }
      coords = [];
    }

    // Touch prevention
    svg.node()?.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length === 1) e.preventDefault();
      },
      { passive: false }
    );

    // Zoom
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 15])
      .on("zoom", (event) => {
        const { k } = event.transform;
        container.attr("transform", event.transform);
        container.selectAll("circle").attr("r", BASE_RADIUS / k);
        container.selectAll("line").attr("stroke-width", BASE_LINE_WIDTH / k);
      });

    svg.call(zoom);

    // Prepare data
    const points = data.map(([i, [x, y]]) => ({ i, x, y }));
    const xExtent = d3.extent(points, (d) => d.x)! as [number, number];
    const yExtent = d3.extent(points, (d) => d.y)! as [number, number];

    const dataWidth = xExtent[1] - xExtent[0];
    const dataHeight = yExtent[1] - yExtent[0];
    const dataAspect = dataWidth / dataHeight;

    const topOffset = 0;
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

    xScale = d3.scaleLinear().domain(xExtent).range(xRange);
    yScale = d3.scaleLinear().domain(yExtent).range(yRange);

    // Origin axes
    // container
    //   .append("line")
    //   .attr("class", "origin-axis")
    //   .attr("stroke", "gray")
    //   .attr("stroke-width", BASE_LINE_WIDTH)
    //   .attr("x1", 0)
    //   .attr("x2", width)
    //   .attr("y1", yScale(0))
    //   .attr("y2", yScale(0));

    // container
    //   .append("line")
    //   .attr("class", "origin-axis")
    //   .attr("stroke", "gray")
    //   .attr("stroke-width", BASE_LINE_WIDTH)
    //   .attr("x1", xScale(0))
    //   .attr("x2", xScale(0))
    //   .attr("y1", 0)
    //   .attr("y2", height);

    circles = container
      .selectAll("circle")
      .data(points)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", BASE_RADIUS);

    svg.call(zoom.transform, d3.zoomIdentity);
    svg.call(d3.drag<SVGSVGElement, unknown>().on("start", lassoStart).on("drag", lassoDrag).on("end", lassoEnd));

    function pointInPolygon([x, y]: [number, number], vs: [number, number][]) {
      let inside = false;
      for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const [xi, yi] = vs[i],
          [xj, yj] = vs[j];
        const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
      return inside;
    }

    return () => {
      svg.selectAll("*").remove();
    };
  }, [data]);

  return <svg ref={svgRef} className="w-screen h-screen block bg-gray-100" />;
};
