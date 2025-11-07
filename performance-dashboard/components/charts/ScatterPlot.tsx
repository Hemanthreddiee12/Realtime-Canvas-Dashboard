'use client';

import React, { useRef, useCallback, MouseEvent } from 'react';
import { DataPoint } from '@/lib/types';
import { useChartRenderer } from '@/hooks/useChartRenderer';

// 1. Interface is identical to LineChart
interface ScatterPlotProps {
  data: DataPoint[];
  width: number;
  height: number;
  zoom: number;
  panX: number;
  onZoom: (zoom: number) => void;
  onPan: (panX: number) => void;
}

export function ScatterPlot({
  data,
  width,
  height,
  zoom,
  panX,
  onZoom,
  onPan,
}: ScatterPlotProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPanning = useRef(false);
  const lastMouseX = useRef(0);

  // --- 2. THE NEW DRAWING LOGIC ---
  const drawScatterPlot = useCallback((
    ctx: CanvasRenderingContext2D,
    currentData: DataPoint[]
  ) => {
    ctx.clearRect(0, 0, width, height);
    
    // Set the fill style for the dots
    ctx.fillStyle = 'rgba(255, 99, 132, 0.7)'; // A nice reddish color

    const dataLength = currentData.length;
    if (dataLength === 0) return;

    // --- Scaling logic is identical to LineChart ---
    const scaledWidth = width * zoom;
    const startIndex = Math.max(0, Math.floor(((panX) / scaledWidth) * dataLength) - 1);
    const endIndex = Math.min(dataLength, Math.ceil(((panX + width) / scaledWidth) * dataLength) + 1);

    // --- This is the main change ---
    // Instead of beginPath/lineTo, we draw a circle for each point
    for (let i = startIndex; i < endIndex; i++) {
      const point = currentData[i];
      if (!point) continue; // Safety check

      const x = ((i / (dataLength - 1)) * scaledWidth) - panX;
      const y = height - ((point.value - 50) / 100) * height;

      // Draw a small circle (arc)
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI); // x, y, radius, startAngle, endAngle
      ctx.fill();
    }
  }, [width, height, zoom, panX]);

  
  // 3. Our render hook is used in the exact same way
  useChartRenderer(canvasRef, data, drawScatterPlot);

  // --- 4. Event handlers are identical to LineChart ---
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    const newZoom = e.deltaY < 0 ? zoom * zoomFactor : zoom / zoomFactor;
    onZoom(Math.max(1, Math.min(newZoom, 100))); 
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isPanning.current = true;
    lastMouseX.current = e.clientX;
    (e.target as SVGElement).style.cursor = 'grabbing';
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    isPanning.current = false;
    (e.target as SVGElement).style.cursor = 'grab';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const deltaX = e.clientX - lastMouseX.current;
    lastMouseX.current = e.clientX;
    
    const scaledWidth = width * zoom;
    const maxPan = scaledWidth - width;
    onPan(Math.max(0, Math.min(panX - deltaX, maxPan)));
  };
  
  const handleMouseLeave = (e: React.MouseEvent) => {
    isPanning.current = false;
    (e.target as SVGElement).style.cursor = 'grab';
  };

  // --- 5. JSX is identical to LineChart ---
  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ position: 'absolute', left: 0, top: 0, zIndex: 1 }}
      />
      <svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 2,
          cursor: 'grab',
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Static Y-Axis (same as before) */}
        <line x1="50" y1="20" x2="50" y2={height - 20} stroke="#FFF" strokeWidth="1" />
        <text x="40" y="25" fill="#FFF" textAnchor="end">150</text>
        <text x="40" y={height / 2} fill="#FFF" textAnchor="end">100</text>
        <text x="40" y={height - 25} fill="#FFF" textAnchor="end">50</text>
      </svg>
    </div>
  );
}