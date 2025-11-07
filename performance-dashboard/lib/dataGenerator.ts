import { DataPoint } from "./types";

/**
 * Generates a single new, random data point.
 */
export function generateDataPoint(): DataPoint {
  return {
    timestamp: Date.now(),
    value: Math.random() * 100 + 50, // Random value between 50 and 150
  };
}