/**
 * Defines the structure for a single data point
 * that we will stream from the server.
 */
export interface DataPoint {
  timestamp: number; // Unix timestamp (ms)
  value: number;     // The value to be plotted
}

/**
 * Defines the structure for performance metrics.
 * We will use this in Phase 3.
 */
export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number; // in MB
}

// 1. ADD NEW TYPE for our 2D heatmap data
export type HeatmapData = {
  [timeBucket: number]: { // Key is the timestamp
    [valueBucket: number]: number; // Key is the value, Value is the count
  };
};