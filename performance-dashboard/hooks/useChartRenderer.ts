'use client';

import { useRef, useEffect } from 'react';
import { DataPoint } from '@/lib/types';

// This is the "draw" function signature our chart will provide
export type DrawFunction = (
  ctx: CanvasRenderingContext2D,
  data: DataPoint[]
) => void;

/**
 * This hook manages the high-performance render loop.
 * It's decoupled from React's state updates.
 */
export function useChartRenderer(
  // --- THIS IS THE FIX ---
  // We allow the ref to be 'null', which is its initial state.
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  data: DataPoint[],
  draw: DrawFunction // The specific drawing logic
) {
  // Use a ref to store the data. This prevents the render loop
  // from re-triggering when 'data' changes.
  const dataRef = useRef(data);
  
  // Update the ref whenever data changes, but don't re-render
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    const canvas = canvasRef.current;
    // This check already handles the 'null' case,
    // so our change is perfectly safe.
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // This is our 60fps render loop
    const render = () => {
      // Get the most up-to-date data from the ref
      const currentData = dataRef.current;
      
      // Call the *actual* drawing logic
      draw(ctx, currentData);

      // Request the next frame
      animationFrameId = requestAnimationFrame(render);
    };

    // Start the render loop
    render();

    // Cleanup: stop the loop when the component unmounts
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef, draw]); // Only re-run if canvas or draw function changes
}