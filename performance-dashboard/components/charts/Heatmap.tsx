'use client';

import React, { useRef, useEffect } from 'react';
import { HeatmapData } from '@/lib/types';

interface HeatmapProps {
  data: HeatmapData;
  width: number;
  height: number;
}

// Helper function to map a count to a color
// (Simple linear interpolation from blue to red)
function getColorForCount(count: number, maxCount: number): string {
  if (maxCount === 0) return '#0d47a1'; // Dark blue if no data
  const intensity = Math.min(1, count / maxCount); // 0.0 to 1.0
  const red = Math.round(255 * intensity);
  const blue = Math.round(255 * (1 - intensity));
  return `rgb(${red}, 0, ${blue})`;
}

export function Heatmap({ data, width, height }: HeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // --- 1. Get Data Boundaries ---
    const timeBuckets = Object.keys(data).map(Number).sort((a, b) => a - b);
    if (timeBuckets.length === 0) return;

    // Y-axis value buckets (e.g., 50, 60, 70... 150)
    const valueBuckets = Array.from({ length: 11 }, (_, i) => 50 + i * 10); // 50 to 150
    
    // Find the max count for color scaling
    let maxCount = 0;
    for (const time of timeBuckets) {
      for (const value of valueBuckets) {
        const count = data[time]?.[value] || 0;
        if (count > maxCount) maxCount = count;
      }
    }

    // --- 2. Calculate Cell Size ---
    const cellWidth = width / timeBuckets.length;
    const cellHeight = height / valueBuckets.length;

    // --- 3. Draw the Heatmap ---
    for (let i = 0; i < timeBuckets.length; i++) {
      for (let j = 0; j < valueBuckets.length; j++) {
        const time = timeBuckets[i];
        const value = valueBuckets[j];

        const count = data[time]?.[value] || 0;
        const color = getColorForCount(count, maxCount);

        const x = i * cellWidth;
        // Y-axis is inverted (0 is top)
        const y = (valueBuckets.length - 1 - j) * cellHeight;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellWidth, cellHeight);
      }
    }
  }, [data, width, height]);

  // --- JSX ---
  // A simple canvas is all we need
  return (
    <div style={{ width, height, position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ position: 'absolute', left: 0, top: 0 }}
      />
      {/* TODO: Add SVG axes for the heatmap if time permits */}
    </div>
  );
}