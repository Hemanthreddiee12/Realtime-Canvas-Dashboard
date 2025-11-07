'use client';

import React from 'react';
import { useData, TimeRange } from '../providers/DataProvider';

export function TimeRangeSelector() {
  // 1. Get state and setter from the context
  const { timeRange, setTimeRange } = useData();

  const buttons: { label: string; range: TimeRange }[] = [
    { label: 'Live', range: 'live' },
    { label: 'Last 1 Min', range: '1min' },
    { label: 'Last 5 Min', range: '5min' },
  ];

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-white">Time Range</h3>
      {/* 2. Functional Buttons */}
      <div className="flex space-x-2">
        {buttons.map((btn) => (
          <button
            key={btn.range}
            onClick={() => setTimeRange(btn.range)}
            className={`py-1 px-3 rounded ${
              timeRange === btn.range
                ? 'bg-blue-500 text-white'
                : 'bg-gray-600 text-gray-200'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}