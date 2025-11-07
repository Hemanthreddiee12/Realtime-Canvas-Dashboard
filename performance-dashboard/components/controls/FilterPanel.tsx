'use client';

import React from 'react';
import { useData } from '../providers/DataProvider';

export function FilterPanel() {
  // 1. Get state and setter from the context
  const { valueRange, setValueRange } = useData();

  // 2. Create handlers to update the state
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(e.target.value);
    if (newMin < valueRange.max) {
      setValueRange({ ...valueRange, min: newMin });
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value);
    if (newMax > valueRange.min) {
      setValueRange({ ...valueRange, max: newMax });
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-white">Filter Controls</h3>
      <div className="flex items-center space-x-2">
        {/* 3. Controlled Inputs */}
        <label className="text-gray-300">Min:</label>
        <input
          type="number"
          value={valueRange.min}
          onChange={handleMinChange}
          className="w-full p-1 rounded bg-gray-700 text-white"
          min="50"
          max="150"
        />
        <label className="text-gray-300">Max:</label>
        <input
          type="number"
          value={valueRange.max}
          onChange={handleMaxChange}
          className="w-full p-1 rounded bg-gray-700 text-white"
          min="50"
          max="150"
        />
      </div>
    </div>
  );
}