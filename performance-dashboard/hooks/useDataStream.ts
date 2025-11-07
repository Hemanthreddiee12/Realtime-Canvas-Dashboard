'use client'; // This hook uses React's useState/useEffect, so it's a client component.

import { useState, useEffect } from 'react';
import { DataPoint } from '@/lib/types';

// The assignment requires handling 10,000+ points.
// We'll use 10,000 as our "sliding window" size.
const MAX_DATA_POINTS = 10000;

export function useDataStream() {
  // Store our 10,000 data points in React state.
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    // 1. Create a new EventSource to connect to our API route.
    const eventSource = new EventSource('/api/data');

    // 2. Define what to do when a message is received.
    eventSource.onmessage = (event) => {
      const newDataPoint = JSON.parse(event.data) as DataPoint;

      // This is the core logic for managing our data "window".
      setData((currentData) => [
        // Take the last (MAX_DATA_POINTS - 1) elements...
        ...currentData.slice(-MAX_DATA_POINTS + 1),
        // ...and add the new one to the end.
        newDataPoint,
      ]);
    };

    // 3. Define what to do on an error.
    eventSource.onerror = (err) => {
      console.error('EventSource failed:', err);
      // EventSource will automatically try to reconnect.
    };

    // 4. This is the cleanup function.
    // It runs when the component unmounts.
    return () => {
      eventSource.close();
    };
  }, []); // The empty array [] means this effect runs only ONCE.

  return data;
}