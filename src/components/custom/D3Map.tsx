'use client';

import * as React from 'react';
import * as d3 from 'd3';

type D3MapProps = {
  /** Dataset points in the format [[i, [x, y]], ...] */
  data: [number, [number, number]][];
  /** Interaction mode: "move" for pan/zoom, "paint" for lasso selection */
  mode?: 'move' | 'paint';
};

export const D3Map: React.FC<D3MapProps> = ({ data, mode = 'move' }) => {
  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const margin = 20;
    const BASE_RADIUS = 5 * (window.devicePixelRatio || 1);
    const BASE_LINE_WIDTH = 1 * (window.devicePixelRatio || 1);

    const svg = d3.select(svgRef.current);
    svg.attr('width', width).attr('height', height);
    svg.selectAll('*').remove();

    const container = svg.append('g');

    let xScale: d3.ScaleLinear<number, number>;
    let yScale: d3.ScaleLinear<number, number>;
    let lassoPath: d3.Selection<SVGPathElement, unknown, null, undefined> | null = null;
    let coords: [number, number][] = [];

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

    xScale = d3.scaleLinear().domain(xExtent).range(xRange);
    yScale = d3.scaleLinear().domain(yExtent).range(yRange);

    const circles = container
      .selectAll('circle')
      .data(points)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.x))
      .attr('cy', (d) => yScale(d.y))
      .attr('r', BASE_RADIUS)
      .attr('fill', 'steelblue')
      .attr('opacity', 0.7);

    // zoom behaviour
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 15])
      .filter((event) => {
        if (event.type === 'wheel') return true;
        if (event.type === 'touchstart') return event.touches && event.touches.length >= 2;
        // allow drag-panning only in move mode
        return mode === 'move';
      })
      .on('zoom', (event) => {
        const { k } = event.transform;
        container.attr('transform', event.transform);
        container.selectAll('circle').attr('r', BASE_RADIUS / k);
        container.selectAll('line').attr('stroke-width', BASE_LINE_WIDTH / k);
      });

    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity);

    function lassoStart(event: any) {
      coords = [];
      if (lassoPath) lassoPath.remove();
      lassoPath = svg
        .append('path')
        .attr('fill', 'rgba(0,0,0,0.1)')
        .attr('stroke', '#666')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4 2');
    }

    function lassoDrag(event: any) {
      coords.push([event.x, event.y]);
      if (lassoPath) lassoPath.attr('d', d3.line()(coords));
    }

    function lassoEnd() {
      if (!coords.length) return;
      const transform = d3.zoomTransform(container.node()!);
      circles.classed('selected', (d) => {
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

    if (mode === 'paint') {
      svg
        .append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'transparent')
        .style('cursor', 'crosshair')
        .call(d3.drag<SVGRectElement, unknown>().on('start', lassoStart).on('drag', lassoDrag).on('end', lassoEnd));
    }

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
      svg.selectAll('*').remove();
    };
  }, [data, mode]);

  return <svg ref={svgRef} className="w-screen h-screen block bg-gray-100" />;
};