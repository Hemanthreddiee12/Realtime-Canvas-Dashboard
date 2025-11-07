'use client'; 

// Import all components
import { LineChart } from '@/components/charts/LineChart';
import { ScatterPlot } from '@/components/charts/ScatterPlot'; 
import { BarChart } from '@/components/charts/BarChart';
import { Heatmap } from '@/components/charts/Heatmap';
import { DataTable } from '@/components/ui/DataTable';
import { PerformanceMonitor } from '@/components/ui/PerformanceMonitor';
// 1. IMPORT NEW CONTROLS
import { FilterPanel } from '@/components/controls/FilterPanel';
import { TimeRangeSelector } from '@/components/controls/TimeRangeSelector';

import { useDataStream } from '@/hooks/useDataStream';
import { DataPoint, HeatmapData } from '@/lib/types'; 
import { useState, useMemo } from 'react'; 

// Type definitions
type ChartType = 'line' | 'scatter' | 'bar' | 'heatmap';
type Aggregation = 'realtime' | '10sec' | '30sec';

export default function DashboardPage() {
  // This is the raw 10,000-point array
  const data: DataPoint[] = useDataStream(); 
  
  // State for interactivity
  const [zoom, setZoom] = useState(1); 
  const [panX, setPanX] = useState(0); 
  const [chartType, setChartType] = useState<ChartType>('line');
  const [aggregation, setAggregation] = useState<Aggregation>('realtime'); 

  // Fixed chart dimensions
  const chartWidth = 800;
  const chartHeight = 400;

  // --- Aggregation for Line/Scatter/Bar ---
  const aggregatedData = useMemo(() => {
    if (aggregation === 'realtime') {
      return data; // Return raw data if no aggregation
    }
    const bucketSizeMs = aggregation === '10sec' ? 10000 : 30000;
    const buckets: { [key: number]: { sum: number; count: number } } = {};
    for (const point of data) {
      const bucketTimestamp = Math.floor(point.timestamp / bucketSizeMs) * bucketSizeMs;
      if (!buckets[bucketTimestamp]) {
        buckets[bucketTimestamp] = { sum: 0, count: 0 };
      }
      buckets[bucketTimestamp].sum += point.value;
      buckets[bucketTimestamp].count++;
    }
    return Object.keys(buckets).map((key) => {
      const timestamp = Number(key);
      const bucket = buckets[timestamp];
      return {
        timestamp: timestamp,
        value: bucket.sum / bucket.count, // Calculate average
      };
    });
  }, [data, aggregation]);

  // --- Aggregation for Heatmap ---
  const heatmapData = useMemo(() => {
    const timeBucketSizeMs = 10000; // 10-second buckets
    const valueBucketSize = 10;   // $10 buckets
    const buckets: HeatmapData = {};
    for (const point of data) {
      const timeBucket = Math.floor(point.timestamp / timeBucketSizeMs) * timeBucketSizeMs;
      const valueBucket = Math.floor(point.value / valueBucketSize) * valueBucketSize;
      if (!buckets[timeBucket]) {
        buckets[timeBucket] = {};
      }
      if (!buckets[timeBucket][valueBucket]) {
        buckets[timeBucket][valueBucket] = 0;
      }
      buckets[timeBucket][valueBucket]++; // Increment count
    }
    return buckets;
  }, [data]);

  return (
    <main className="container mx-auto p-4">
      <PerformanceMonitor />

      <h1 className="text-2xl font-bold mb-4">
        Performance-Critical Dashboard
      </h1>
      
      {/* --- 2. ADD NEW CONTROL ROW --- */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <FilterPanel />
        <TimeRangeSelector />
      </div>

      {/* State display section */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg">
          Live Data Points (Window):{' '}
          <strong className="text-green-400">{data.length}</strong> / 10,000
        </p>
        <div className="flex space-x-4">
          <span className="text-sm">Zoom: {zoom.toFixed(2)}x</span>
          <span className="text-sm">Pan X: {panX.toFixed(0)}px</span>
          <button
            onClick={() => { setZoom(1); setPanX(0); }}
            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs"
          >
            Reset View
          </button>
        </div>
      </div>

      {/* Chart Toggles */}
      <div className="mb-2 flex space-x-2">
        <strong>Charts:</strong>
        <button onClick={() => setChartType('line')} className={`py-1 px-3 rounded ${ chartType === 'line' ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-200' }`}>Line</button>
        <button onClick={() => setChartType('scatter')} className={`py-1 px-3 rounded ${ chartType === 'scatter' ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-200' }`}>Scatter</button>
        <button onClick={() => setChartType('bar')} className={`py-1 px-3 rounded ${ chartType === 'bar' ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-200' }`}>Bar</button>
        <button 
          onClick={() => setChartType('heatmap')} 
          className={`py-1 px-3 rounded ${ chartType === 'heatmap' ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-200' }`}
        >
          Heatmap
        </button>
      </div>
      
      {/* Aggregation Toggles */}
      <div className="mb-4 flex space-x-2">
        <strong>Aggregation:</strong>
        <button onClick={() => setAggregation('realtime')} className={`py-1 px-3 rounded ${ aggregation === 'realtime' ? 'bg-purple-500 text-white' : 'bg-gray-600 text-gray-200' }`}>Real-time</button>
        <button onClick={() => setAggregation('10sec')} className={`py-1 px-3 rounded ${ aggregation === '10sec' ? 'bg-purple-500 text-white' : 'bg-gray-600 text-gray-200' }`}>10 Sec Avg</button>
        <button onClick={() => setAggregation('30sec')} className={`py-1 px-3 rounded ${ aggregation === '30sec' ? 'bg-purple-500 text-white' : 'bg-gray-600 text-gray-200' }`}>30 Sec Avg</button>
      </div>

      {/* 2-column layout (Charts + Table) */}
      <div className="flex flex-col lg:flex-row gap-4">
        
        {/* Left Column (Charts) */}
        <div className="flex-grow lg:w-2/3">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            
            {/* Conditional Chart Rendering */}
            {chartType === 'line' && (
              <LineChart data={aggregatedData} width={chartWidth} height={chartHeight} zoom={zoom} panX={panX} onZoom={setZoom} onPan={setPanX} />
            )}
            {chartType === 'scatter' && (
              <ScatterPlot data={aggregatedData} width={chartWidth} height={chartHeight} zoom={zoom} panX={panX} onZoom={setZoom} onPan={setPanX} />
            )}
            {chartType === 'bar' && (
              <BarChart data={aggregatedData} width={chartWidth} height={chartHeight} />
            )}
            {chartType === 'heatmap' && (
              <Heatmap data={heatmapData} width={chartWidth} height={chartHeight} />
            )}
          </div>
        </div>
        
        {/* Right Column (Data Table) */}
        <div className="flex-shrink-0 lg:w-1/3">
          <DataTable data={data} height={chartHeight + 32} />
        </div>
        
      </div>
    </main>
  );
}