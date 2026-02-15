/**
 * Security Service
 * PIN management, tamper detection, session locking, and device binding.
 */

const PIN_KEY = "upix_pin_hash";
const LOCK_TIMEOUT_KEY = "upix_lock_timeout";
const LAST_ACTIVITY_KEY = "upix_last_activity";
const LOGIN_HISTORY_KEY = "upix_login_history";
const TAMPER_KEY = "upix_tamper_flags";

// ── PIN Management ──

const hashPin = async (pin: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + "upix_salt_v1");
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, "0")).join("");
};

export const isPinSet = (): boolean => !!localStorage.getItem(PIN_KEY);

export const setPin = async (pin: string): Promise<void> => {
  const hash = await hashPin(pin);
  localStorage.setItem(PIN_KEY, hash);
};

export const verifyPin = async (pin: string): Promise<boolean> => {
  const stored = localStorage.getItem(PIN_KEY);
  if (!stored) return true; // No PIN set — allow through
  const hash = await hashPin(pin);
  return hash === stored;
};

export const clearPin = (): void => localStorage.removeItem(PIN_KEY);

// ── Session Lock ──

export const DEFAULT_LOCK_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export const getLockTimeout = (): number => {
  const stored = localStorage.getItem(LOCK_TIMEOUT_KEY);
  return stored ? parseInt(stored, 10) : DEFAULT_LOCK_TIMEOUT_MS;
};

export const setLockTimeout = (ms: number): void => {
  localStorage.setItem(LOCK_TIMEOUT_KEY, String(ms));
};

export const updateLastActivity = (): void => {
  localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
};

export const isSessionLocked = (): boolean => {
  if (!isPinSet()) return false;
  const last = localStorage.getItem(LAST_ACTIVITY_KEY);
  if (!last) return true;
  return Date.now() - parseInt(last, 10) > getLockTimeout();
};

// ── Tamper Detection (simulated) ──

export interface TamperReport {
  rooted: boolean;
  debuggerAttached: boolean;
  signatureMismatch: boolean;
  timestamp: number;
  safe: boolean;
}

export const runTamperCheck = (): TamperReport => {
  // Simulated checks — in production these would use Capacitor plugins
  const report: TamperReport = {
    rooted: false,
    debuggerAttached: typeof window !== "undefined" && !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__,
    signatureMismatch: false,
    timestamp: Date.now(),
    safe: true,
  };
  // DevTools detection is informational only in prototype
  report.safe = !report.rooted && !report.signatureMismatch;
  localStorage.setItem(TAMPER_KEY, JSON.stringify(report));
  return report;
};

export const getLastTamperReport = (): TamperReport | null => {
  try {
    const raw = localStorage.getItem(TAMPER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// ── Login History ──

export interface LoginEntry {
  timestamp: number;
  method: "pin" | "otp" | "biometric";
  deviceInfo: string;
}

export const recordLogin = (method: LoginEntry["method"]): void => {
  const history = getLoginHistory();
  history.unshift({
    timestamp: Date.now(),
    method,
    deviceInfo: navigator.userAgent.slice(0, 60),
  });
  // Keep last 20
  localStorage.setItem(LOGIN_HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
};

export const getLoginHistory = (): LoginEntry[] => {
  try {
    const raw = localStorage.getItem(LOGIN_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// ── Device Binding ──

export const getDeviceFingerprint = (): Record<string, string> => ({
  platform: navigator.platform,
  language: navigator.language,
  cores: String(navigator.hardwareConcurrency || "unknown"),
  screenRes: `${screen.width}x${screen.height}`,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});
