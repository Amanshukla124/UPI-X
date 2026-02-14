import { useEffect, useRef, useCallback, useState } from "react";
import { useConnectivity } from "./useConnectivity";
import { getPendingTokens } from "@/services/tokenEngine";
import { runFullSync, saveLastSyncReport, type SyncReport, type SyncStatus } from "@/services/syncEngine";
import { toast } from "sonner";

/**
 * Auto-sync hook: detects connectivity restoration and triggers settlement.
 * Notifies via toast on completion.
 */
export const useAutoSync = (
  onSyncComplete?: (report: SyncReport) => void
) => {
  const { isOnline } = useConnectivity();
  const wasOfflineRef = useRef(!isOnline);
  const syncingRef = useRef(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [lastReport, setLastReport] = useState<SyncReport | null>(null);
  const [progress, setProgress] = useState<{ settled: number; total: number }>({ settled: 0, total: 0 });

  const triggerSync = useCallback(async () => {
    const pending = getPendingTokens();
    if (pending.length === 0 || syncingRef.current) return;

    syncingRef.current = true;
    setSyncStatus("syncing");
    setProgress({ settled: 0, total: pending.length });

    try {
      const report = await runFullSync((p) => {
        if (p.settled !== undefined && p.total !== undefined) {
          setProgress({ settled: p.settled, total: p.total });
        }
      });

      saveLastSyncReport(report);
      setLastReport(report);
      setSyncStatus("complete");

      // Toast notifications
      if (report.settled > 0) {
        toast.success(`${report.settled} payment${report.settled > 1 ? "s" : ""} settled successfully`);
      }
      if (report.failed > 0) {
        toast.error(`${report.failed} payment${report.failed > 1 ? "s" : ""} failed to settle — funds refunded`);
      }
      if (report.expired > 0) {
        toast.warning(`${report.expired} expired token${report.expired > 1 ? "s" : ""} — funds refunded`);
      }

      onSyncComplete?.(report);
    } catch {
      setSyncStatus("error");
      toast.error("Sync failed — will retry when connection is stable");
    } finally {
      syncingRef.current = false;
    }
  }, [onSyncComplete]);

  // Auto-trigger when going from offline → online
  useEffect(() => {
    if (isOnline && wasOfflineRef.current) {
      const pending = getPendingTokens();
      if (pending.length > 0) {
        toast.info("Back online — syncing offline payments…");
        triggerSync();
      }
    }
    wasOfflineRef.current = !isOnline;
  }, [isOnline, triggerSync]);

  return { syncStatus, lastReport, progress, triggerSync, isOnline };
};
