'use client';

import { DataPoint, HeatmapData } from '@/lib/types';
import { useDataStream } from '@/hooks/useDataStream';
import React, { createContext, useContext, useMemo, useState } from 'react';

// --- 1. Define new types and state ---
export type ChartType = 'line' | 'scatter' | 'bar' | 'heatmap';
export type Aggregation = 'realtime' | '10sec' | '30sec';
export type TimeRange = 'live' | '1min' | '5min';
export interface ValueRange { min: number; max: number; }

interface DataContextState {
  // Raw Data
  rawData: DataPoint[];
  // Processed Data
  displayData: DataPoint[]; // The new filtered array
  aggregatedData: DataPoint[];
  heatmapData: HeatmapData;
  // Chart State
  chartType: ChartType;
  setChartType: (type: ChartType) => void;
  aggregation: Aggregation;
  setAggregation: (agg: Aggregation) => void;
  // Interactive State
  zoom: number;
  setZoom: (zoom: number) => void;
  panX: number;
  setPanX: (panX: number) => void;
  // Filter State
  valueRange: ValueRange;
  setValueRange: (range: ValueRange) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

const DataContext = createContext<DataContextState | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  // --- 2. Add new state variables ---
  const rawData: DataPoint[] = useDataStream();
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [chartType, setChartType] = useState<ChartType>('line');
  const [aggregation, setAggregation] = useState<Aggregation>('realtime');
  const [valueRange, setValueRange] = useState<ValueRange>({ min: 50, max: 150 });
  const [timeRange, setTimeRange] = useState<TimeRange>('live');

  // --- 3. Create the new 'displayData' memo ---
  // This filters the raw data based on the new controls
  const displayData = useMemo(() => {
    let dataToProcess = rawData;
    const now = Date.now();

    // A. Filter by Time Range
    if (timeRange !== 'live') {
      const rangeMs = timeRange === '1min' ? 60000 : 300000; // 1 min or 5 min
      dataToProcess = dataToProcess.filter(p => p.timestamp > now - rangeMs);
    }

    // B. Filter by Value Range
    if (valueRange.min !== 50 || valueRange.max !== 150) {
      dataToProcess = dataToProcess.filter(p => 
        p.value >= valueRange.min && p.value <= valueRange.max
      );
    }
    
    return dataToProcess;
  }, [rawData, timeRange, valueRange]);

  // --- 4. Update Aggregation memos to use 'displayData' ---
  const aggregatedData = useMemo(() => {
    if (aggregation === 'realtime') {
      return displayData; // Pass-through the filtered data
    }

    // Use 'displayData' as the source, not 'rawData'
    const bucketSizeMs = aggregation === '10sec' ? 10000 : 30000;
    const buckets: { [key: number]: { sum: number; count: number } } = {};
    for (const point of displayData) { 
      const bucketTimestamp = Math.floor(point.timestamp / bucketSizeMs) * bucketSizeMs;
      if (!buckets[bucketTimestamp]) buckets[bucketTimestamp] = { sum: 0, count: 0 };
      buckets[bucketTimestamp].sum += point.value;
      buckets[bucketTimestamp].count++;
    }
    return Object.keys(buckets).map((key) => {
      const timestamp = Number(key);
      const bucket = buckets[timestamp];
      return { timestamp, value: bucket.sum / bucket.count };
    });
  }, [displayData, aggregation]); // Depends on displayData now

  const heatmapData = useMemo(() => {
    // Use 'displayData' as the source, not 'rawData'
    const timeBucketSizeMs = 10000;
    const valueBucketSize = 10;
    const buckets: HeatmapData = {};
    for (const point of displayData) {
      const timeBucket = Math.floor(point.timestamp / timeBucketSizeMs) * timeBucketSizeMs;
      const valueBucket = Math.floor(point.value / valueBucketSize) * valueBucketSize;
      if (!buckets[timeBucket]) buckets[timeBucket] = {};
      if (!buckets[timeBucket][valueBucket]) buckets[timeBucket][valueBucket] = 0;
      buckets[timeBucket][valueBucket]++;
    }
    return buckets;
  }, [displayData]); // Depends on displayData now

  // --- 5. Provide all new values ---
  const value: DataContextState = {
    rawData,
    displayData, // Provide new filtered data
    aggregatedData,
    heatmapData,
    chartType,
    setChartType,
    aggregation,
    setAggregation,
    zoom,
    setZoom,
    panX,
    setPanX,
    valueRange,   // Provide new state
    setValueRange,// Provide new setter
    timeRange,    // Provide new state
    setTimeRange, // Provide new setter
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextState {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}