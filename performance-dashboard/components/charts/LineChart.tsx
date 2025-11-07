'use client';

import React, { useRef, useCallback, MouseEvent } from 'react'; // 1. IMPORT MouseEvent
import { DataPoint } from '@/lib/types';
import { useChartRenderer } from '@/hooks/useChartRenderer';

// 2. UPDATE the props interface
interface LineChartProps {
  data: DataPoint[];
  width: number;
  height: number;
  zoom: number;
  panX: number;
  onZoom: (zoom: number) => void;
  onPan: (panX: number) => void;
}

export function LineChart({
  data,
  width,
  height,
  zoom,
  panX,
  onZoom,
  onPan,
}: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isPanning = useRef(false);
  const lastMouseX = useRef(0);

  // --- 3. UPDATE THE DRAWING LOGIC ---
  const drawLineChart = useCallback((
    ctx: CanvasRenderingContext2D,
    currentData: DataPoint[]
  ) => {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.strokeStyle = '#00C49F';
    ctx.lineWidth = 2;

    const dataLength = currentData.length;
    if (dataLength === 0) return;

    // --- NEW SCALING LOGIC ---
    // Calculate the visible data range based on zoom and pan
    const scaledWidth = width * zoom;
    
    // Calculate start and end index of data to draw
    // This is a simple optimization: don't loop over 10,000 points
    // if we are zoomed in and only showing 100.
    const startIndex = Math.max(0, Math.floor(((panX) / scaledWidth) * dataLength) - 1);
    const endIndex = Math.min(dataLength, Math.ceil(((panX + width) / scaledWidth) * dataLength) + 1);

    let firstPoint = true;

    for (let i = startIndex; i < endIndex; i++) {
      const point = currentData[i];

      // X: Map data index to the *total scaled width* and then apply pan
      const x = ((i / (dataLength - 1)) * scaledWidth) - panX;
      
      // Y: Same as before
      const y = height - ((point.value - 50) / 100) * height;

      if (firstPoint) {
        ctx.moveTo(x, y);
        firstPoint = false;
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }, [width, height, zoom, panX]); // 4. ADD zoom and panX to dependency array

  
  useChartRenderer(canvasRef, data, drawLineChart);

  // --- 5. ADD EVENT HANDLERS ---
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    const newZoom = e.deltaY < 0 ? zoom * zoomFactor : zoom / zoomFactor;
    // Clamp zoom level
    onZoom(Math.max(1, Math.min(newZoom, 100))); // Min 1x, Max 100x zoom
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
    
    // New pan = old pan - delta
    // We also clamp panning so you can't pan past the edges
    const scaledWidth = width * zoom;
    const maxPan = scaledWidth - width;
    onPan(Math.max(0, Math.min(panX - deltaX, maxPan)));
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    isPanning.current = false;
    (e.target as SVGElement).style.cursor = 'grab';
  };

  // --- 6. UPDATE THE JSX ---
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
          cursor: 'grab', // Add grab cursor
        }}
        // ADD THE HANDLERS TO THE SVG
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* The axes are no longer correct because they don't pan/zoom.
            We will fix this in a later step.
            For now, we'll just keep the static Y-Axis. */}
        <line x1="50" y1="20" x2="50" y2={height - 20} stroke="#FFF" strokeWidth="1" />
        <text x="40" y="25" fill="#FFF" textAnchor="end">150</text>
        <text x="40" y={height / 2} fill="#FFF" textAnchor="end">100</text>
        <text x="40" y={height - 25} fill="#FFF" textAnchor="end">50</text>
      </svg>
    </div>
  );
}