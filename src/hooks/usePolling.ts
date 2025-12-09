import { useCallback, useEffect, useRef, useState } from 'react';

interface UsePollingOptions {
  interval: number;
  immediate?: boolean;
}

interface UsePollingReturn {
  startPolling: () => void;
  stopPolling: () => void;
  isPolling: boolean;
}

export function usePolling(
  apiFn: () => Promise<void>,
  options: UsePollingOptions
): UsePollingReturn {
  const { interval, immediate = false } = options;
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return; // Already polling
    
    setIsPolling(true);
    
    // Execute immediately if requested
    if (immediate) {
      apiFn();
    }
    
    intervalRef.current = setInterval(async () => {
      if (isMountedRef.current) {
        await apiFn();
      }
    }, interval);
  }, [apiFn, interval, immediate]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { startPolling, stopPolling, isPolling };
}
