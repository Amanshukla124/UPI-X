import { useState, useEffect, useCallback } from "react";

/**
 * Tracks online/offline connectivity with simulated toggle for testing.
 */
export const useConnectivity = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [simulatedOffline, setSimulatedOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const toggleSimulatedOffline = useCallback(() => {
    setSimulatedOffline(prev => !prev);
  }, []);

  const effectiveOnline = isOnline && !simulatedOffline;

  return { isOnline: effectiveOnline, realOnline: isOnline, simulatedOffline, toggleSimulatedOffline };
};
