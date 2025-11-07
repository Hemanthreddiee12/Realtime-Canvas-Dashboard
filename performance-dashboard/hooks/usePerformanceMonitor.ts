'use client';

import { useState, useEffect, useRef } from 'react';

export function usePerformanceMonitor() {
  const [fps, setFps] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const animationFrameId = useRef(0);

  useEffect(() => {
    const loop = (time: number) => {
      // Increment frame count
      frameCount.current++;

      // Calculate elapsed time
      const elapsedTime = time - lastTime.current;

      // Update FPS every second
      if (elapsedTime > 1000) {
        const calculatedFps = (frameCount.current * 1000) / elapsedTime;
        setFps(Math.round(calculatedFps));

        // Reset for next calculation
        lastTime.current = time;
        frameCount.current = 0;
      }

      // Request next frame
      animationFrameId.current = requestAnimationFrame(loop);
    };

    // Start the loop
    animationFrameId.current = requestAnimationFrame(loop);

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return { fps };
}