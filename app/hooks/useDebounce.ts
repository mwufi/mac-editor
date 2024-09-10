'use client';

import { useCallback, useRef } from 'react';

export function useDebounce(callback: Function, delay: number) {
  // Store the timeout reference
  const timeoutRef = useRef<number | null>(null);

  // Return a memoized debounced function
  return useCallback((...args: any[]) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = window.setTimeout(() => {
      // Execute the callback with provided arguments
      callback(...args);
    }, delay);
  }, [callback, delay]);
}