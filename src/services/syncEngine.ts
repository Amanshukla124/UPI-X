/**
 * Offline → Online Sync Engine
 * Handles automatic connectivity detection, background settlement,
 * retry policies (max 3 attempts, exponential backoff), and conflict resolution.
 */

import { getPendingTokens, markTokenSpent, validateToken, getExpiredTokens, clearExpiredTokens, type OfflineToken } from "./tokenEngine";

export type SyncStatus = "idle" | "syncing" | "complete" | "error";

export interface SyncResult {
  tokenId: string;
  merchantName: string;
  amount: number;
  success: boolean;
  reason?: string;
  attempts: number;
}

export interface SyncReport {
  total: number;
  settled: number;
  failed: number;
  expired: number;
  refunded: number;
  results: SyncResult[];
  timestamp: number;
}

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000; // Exponential backoff base

// Retry record persisted per-session
const retryCountMap = new Map<string, number>();

/**
 * Simulate UPI settlement for a single token (production: real UPI API call)
 */
const settleTokenWithUPI = async (token: OfflineToken): Promise<{ success: boolean; reason?: string }> => {
  // Simulate network latency
  await new Promise(r => setTimeout(r, 600 + Math.random() * 400));

  // Validate token integrity before settling
  const validation = await validateToken(token);
  if (!validation.valid) {
    return { success: false, reason: validation.reason };
  }

  // 95% settlement success rate
  if (Math.random() > 0.05) {
    return { success: true };
  }
  return { success: false, reason: "UPI settlement timeout" };
};

/**
 * Attempt to settle a single token with retry and exponential backoff
 */
const settleWithRetry = async (
  token: OfflineToken,
  onProgress?: (tokenId: string, attempt: number) => void
): Promise<SyncResult> => {
  const currentRetries = retryCountMap.get(token.id) || 0;
  let attempt = currentRetries;

  while (attempt < MAX_RETRIES) {
    attempt++;
    retryCountMap.set(token.id, attempt);

    onProgress?.(token.id, attempt);

    const result = await settleTokenWithUPI(token);

    if (result.success) {
      markTokenSpent(token.id);
      retryCountMap.delete(token.id);
      return {
        tokenId: token.id,
        merchantName: token.merchantName,
        amount: token.amount,
        success: true,
        attempts: attempt,
      };
    }

    // Non-retryable failures (token integrity issues)
    if (result.reason && ["Token already spent", "Device mismatch", "Invalid signature"].includes(result.reason)) {
      markTokenSpent(token.id);
      retryCountMap.delete(token.id);
      return {
        tokenId: token.id,
        merchantName: token.merchantName,
        amount: token.amount,
        success: false,
        reason: result.reason,
        attempts: attempt,
      };
    }

    // Exponential backoff before retry
    if (attempt < MAX_RETRIES) {
      const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
      await new Promise(r => setTimeout(r, delay));
    }
  }

  // Max retries exhausted
  return {
    tokenId: token.id,
    merchantName: token.merchantName,
    amount: token.amount,
    success: false,
    reason: `Failed after ${MAX_RETRIES} attempts`,
    attempts: attempt,
  };
};

/**
 * Run full sync: settle all pending tokens and handle expired ones
 */
export const runFullSync = async (
  onProgress?: (report: Partial<SyncReport> & { currentToken?: string; currentAttempt?: number }) => void
): Promise<SyncReport> => {
  // Step 1: Handle expired tokens (refund)
  const expiredTokens = getExpiredTokens();
  const expiredCount = clearExpiredTokens();

  const pendingTokens = getPendingTokens();
  const total = pendingTokens.length + expiredCount;

  if (total === 0) {
    return { total: 0, settled: 0, failed: 0, expired: 0, refunded: 0, results: [], timestamp: Date.now() };
  }

  onProgress?.({ total, settled: 0, failed: 0, expired: expiredCount, refunded: expiredCount });

  const results: SyncResult[] = [];
  let settled = 0;
  let failed = 0;

  // Step 2: Settle each pending token
  for (const token of pendingTokens) {
    const result = await settleWithRetry(token, (tokenId, attempt) => {
      onProgress?.({
        total,
        settled,
        failed,
        expired: expiredCount,
        refunded: expiredCount + failed,
        currentToken: tokenId,
        currentAttempt: attempt,
      });
    });

    results.push(result);
    if (result.success) {
      settled++;
    } else {
      failed++;
    }

    onProgress?.({ total, settled, failed, expired: expiredCount, refunded: expiredCount + failed, results });
  }

  // Add expired token results
  for (const token of expiredTokens) {
    results.push({
      tokenId: token.id,
      merchantName: token.merchantName,
      amount: token.amount,
      success: false,
      reason: "Token expired — funds refunded",
      attempts: 0,
    });
  }

  return {
    total,
    settled,
    failed,
    expired: expiredCount,
    refunded: expiredCount + failed,
    results,
    timestamp: Date.now(),
  };
};

/**
 * Get last sync report from session storage
 */
const SYNC_REPORT_KEY = "upix_last_sync_report";

export const saveLastSyncReport = (report: SyncReport): void => {
  sessionStorage.setItem(SYNC_REPORT_KEY, JSON.stringify(report));
};

export const getLastSyncReport = (): SyncReport | null => {
  try {
    const raw = sessionStorage.getItem(SYNC_REPORT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
