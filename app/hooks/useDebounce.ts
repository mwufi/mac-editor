'use client';

import { useCallback, useRef, useEffect } from 'react';

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  // Store the timeout reference
  const timeoutRef = useRef<number | null>(null);
  
  // Store the latest callback
  const latestCallback = useRef(callback);

  // Update the latest callback whenever it changes
  useEffect(() => {
    latestCallback.current = callback;
  }, [callback]);

  // Return a memoized debounced function
  return useCallback((...args: Parameters<T>) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = window.setTimeout(() => {
      // Execute the latest callback with provided arguments
      latestCallback.current(...args);
    }, delay);
  }, [delay]);
}