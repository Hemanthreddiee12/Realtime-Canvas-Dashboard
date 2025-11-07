'use client';

import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

export function PerformanceMonitor() {
  const { fps } = usePerformanceMonitor();

  // Determine color based on FPS
  const fpsColor =
    fps >= 55 ? 'text-green-500' : fps >= 40 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="fixed top-2 right-2 bg-gray-900 bg-opacity-80 p-2 rounded-md shadow-lg z-50">
      <span className={`text-lg font-bold ${fpsColor}`}>
        {fps} FPS
      </span>
    </div>
  );
}