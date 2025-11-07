'use client';

import React, { useRef } from 'react';
import { DataPoint } from '@/lib/types';
import { useVirtualization } from '@/hooks/useVirtualization';

interface DataTableProps {
  data: DataPoint[];
  height: number; // The total height of the table container
}

const ROW_HEIGHT = 30; // Each row is 30px tall

export function DataTable({ data, height }: DataTableProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 1. Use our virtualization hook
  const { startIndex, endIndex, paddingTop, totalHeight } = useVirtualization({
    itemHeight: ROW_HEIGHT,
    containerRef: containerRef,
    itemCount: data.length,
  });

  // 2. Slice the data!
  // We only get the items that are currently visible.
  const visibleItems = data.slice(startIndex, endIndex);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Virtualized Data Table</h3>
      {/* 3. The scrolling container */}
      <div
        ref={containerRef}
        style={{ height, overflowY: 'auto', border: '1px solid #444' }}
        className="bg-gray-900"
      >
        {/* 4. The "spacer" div that creates the full height */}
        <div style={{ height: totalHeight, position: 'relative' }}>
          {/* 5. The "window" that moves with the scroll */}
          <div style={{ transform: `translateY(${paddingTop}px)` }}>
            {/* 6. Render ONLY the visible items */}
            {visibleItems.map((item, index) => {
              // We need the original index for the item key
              const originalIndex = startIndex + index;
              
              return (
                <div
                  key={originalIndex}
                  style={{ height: ROW_HEIGHT }}
                  className="flex justify-between items-center p-2 border-b border-gray-700"
                >
                  <span className="text-gray-400">Row: {originalIndex + 1}</span>
                  <span className="text-gray-300">
                    Time: {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-green-400">
                    Value: {item.value.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}