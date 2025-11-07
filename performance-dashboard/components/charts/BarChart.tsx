'use client';

import React, { useRef, useEffect } from 'react';
import { DataPoint } from '@/lib/types';

interface BarChartProps {
  data: DataPoint[];
  width: number;
  height: number;
}

export function BarChart({ data, width, height }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // We use the simple "naive" render because the data is pre-aggregated
  // and the array is small. No 60fps loop is needed.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    if (data.length === 0) return;

    // --- Bar Chart Drawing Logic ---
    const barWidth = width / data.length;
    const padding = 2; // 2px padding between bars
    const axisY = height - 20; // X-axis position

    for (let i = 0; i < data.length; i++) {
      const point = data[i];
      const barHeight = ((point.value - 50) / 100) * (height - 20);
      const x = i * barWidth;
      const y = axisY - barHeight;

      // Draw the bar
      ctx.fillStyle = '#FFB900'; // A yellow color
      ctx.fillRect(x + padding, y, barWidth - padding * 2, barHeight);
    }

  }, [data, width, height]); // Re-draw when data or dimensions change

  // --- JSX ---
  // No complex SVG overlay needed for this simple version
  return (
    <div style={{ width, height, position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ position: 'absolute', left: 0, top: 0, zIndex: 1 }}
      />
      {/* We can still render a simple static axis */}
      <svg
        width={width}
        height={height}
        style={{ position: 'absolute', left: 0, top: 0, zIndex: 2, pointerEvents: 'none' }}
      >
        <line x1="0" y1={height - 20} x2={width} y2={height - 20} stroke="#FFF" strokeWidth="1" />
      </svg>
    </div>
  );
}