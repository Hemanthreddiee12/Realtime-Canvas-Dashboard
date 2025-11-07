'use client';

import { useState, useEffect, RefObject } from 'react';

interface VirtualizationOptions {
  itemHeight: number;
  // --- THIS IS THE FIX ---
  // We now accept a ref that can be null, which matches how useRef() works.
  containerRef: RefObject<HTMLElement | null>; 
  itemCount: number;
  overscan?: number;
}

export function useVirtualization({
  itemHeight,
  containerRef,
  itemCount,
  overscan = 5,
}: VirtualizationOptions) {
  const [scrollTop, setScrollTop] = useState(0);

  // 1. Scroll event handler
  useEffect(() => {
    const container = containerRef.current;
    // This 'if' statement already handles the 'null' case
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  // 2. The core virtualization math
  const containerHeight = containerRef.current?.clientHeight || 0;

  let startIndex = Math.floor(scrollTop / itemHeight);
  let endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight);

  startIndex = Math.max(0, startIndex - overscan);
  endIndex = Math.min(itemCount, endIndex + overscan);

  // 3. Calculate padding
  const paddingTop = startIndex * itemHeight;
  const totalHeight = itemCount * itemHeight;

  return {
    startIndex,
    endIndex,
    paddingTop,
    totalHeight,
  };
}