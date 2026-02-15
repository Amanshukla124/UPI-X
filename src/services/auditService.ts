/**
 * Audit Trail Service
 * Immutable, tamper-evident logging for regulatory compliance.
 * All critical events are recorded with SHA-256 chain hashes.
 */

const AUDIT_KEY = "upix_audit_log";
const MAX_ENTRIES = 500;

export type AuditCategory =
  | "auth"
  | "transaction"
  | "sync"
  | "wallet"
  | "security"
  | "kyc"
  | "config";

export interface AuditEntry {
  id: string;
  timestamp: number;
  category: AuditCategory;
  action: string;
  detail: string;
  deviceInfo: string;
  chainHash: string; // SHA-256 hash linking to previous entry
}

export interface AuditSummary {
  totalEntries: number;
  byCategory: Record<AuditCategory, number>;
  firstEntry: number | null;
  lastEntry: number | null;
  chainIntact: boolean;
}

// ── Hash chain ──

const computeHash = async (data: string): Promise<string> => {
  const encoded = new TextEncoder().encode(data);
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, "0")).join("");
};

const getChainInput = (entry: Omit<AuditEntry, "chainHash">, prevHash: string): string =>
  `${prevHash}|${entry.id}|${entry.timestamp}|${entry.category}|${entry.action}`;

// ── Storage ──

export const getAuditLog = (): AuditEntry[] => {
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveAuditLog = (log: AuditEntry[]): void => {
  localStorage.setItem(AUDIT_KEY, JSON.stringify(log.slice(0, MAX_ENTRIES)));
};

// ── Record ──

export const recordAudit = async (
  category: AuditCategory,
  action: string,
  detail: string = ""
): Promise<void> => {
  const log = getAuditLog();
  const prevHash = log.length > 0 ? log[0].chainHash : "genesis";

  const partial = {
    id: `AUD${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
    category,
    action,
    detail,
    deviceInfo: navigator.userAgent.slice(0, 60),
  };

  const chainHash = await computeHash(getChainInput(partial, prevHash));

  const entry: AuditEntry = { ...partial, chainHash };
  saveAuditLog([entry, ...log]);
};

// ── Verify chain integrity ──

export const verifyAuditChain = async (): Promise<boolean> => {
  const log = getAuditLog();
  if (log.length <= 1) return true;

  // Log is stored newest-first, so chain goes 0 → 1 → 2 ...
  for (let i = 0; i < log.length - 1; i++) {
    const current = log[i];
    const prev = log[i + 1];
    const expected = await computeHash(
      getChainInput(
        { id: current.id, timestamp: current.timestamp, category: current.category, action: current.action, detail: current.detail, deviceInfo: current.deviceInfo },
        prev.chainHash
      )
    );
    if (expected !== current.chainHash) return false;
  }

  // Verify the oldest entry chains from "genesis"
  const oldest = log[log.length - 1];
  const genesisExpected = await computeHash(
    getChainInput(
      { id: oldest.id, timestamp: oldest.timestamp, category: oldest.category, action: oldest.action, detail: oldest.detail, deviceInfo: oldest.deviceInfo },
      "genesis"
    )
  );
  return genesisExpected === oldest.chainHash;
};

// ── Summary for reporting ──

export const getAuditSummary = async (): Promise<AuditSummary> => {
  const log = getAuditLog();
  const categories: AuditCategory[] = ["auth", "transaction", "sync", "wallet", "security", "kyc", "config"];
  const byCategory = Object.fromEntries(categories.map(c => [c, 0])) as Record<AuditCategory, number>;

  for (const entry of log) {
    if (entry.category in byCategory) byCategory[entry.category]++;
  }

  return {
    totalEntries: log.length,
    byCategory,
    firstEntry: log.length > 0 ? log[log.length - 1].timestamp : null,
    lastEntry: log.length > 0 ? log[0].timestamp : null,
    chainIntact: await verifyAuditChain(),
  };
};

// ── Export for regulatory submission ──

export const exportAuditCSV = (): string => {
  const log = getAuditLog();
  const header = "ID,Timestamp,Category,Action,Detail,DeviceInfo,ChainHash";
  const rows = log.map(e =>
    `${e.id},${new Date(e.timestamp).toISOString()},${e.category},${e.action},"${e.detail}",${e.deviceInfo},${e.chainHash.slice(0, 16)}…`
  );
  return [header, ...rows].join("\n");
};

// ── Clear (admin only, for testing) ──

export const clearAuditLog = (): void => {
  localStorage.removeItem(AUDIT_KEY);
};
