/**
 * Offline Token Engine
 * Generates cryptographic tokens for offline payments using Web Crypto API (simulated).
 * Tokens are device-bound, time-limited (48h), and prevent double-spending.
 */

export interface OfflineToken {
  id: string;
  serialNumber: string;
  amount: number;
  merchantId: string;
  merchantName: string;
  deviceId: string;
  nonce: string;
  timestamp: number;
  expiresAt: number;
  signature: string;
  spent: boolean;
}

const TOKEN_EXPIRY_MS = 48 * 60 * 60 * 1000; // 48 hours

// Simulated device ID (in production: hardware-bound via Capacitor secure storage)
let cachedDeviceId: string | null = null;
export const getDeviceId = (): string => {
  if (cachedDeviceId) return cachedDeviceId;
  let id = localStorage.getItem("upix_device_id");
  if (!id) {
    id = `DEV-${crypto.randomUUID()}`;
    localStorage.setItem("upix_device_id", id);
  }
  cachedDeviceId = id;
  return id;
};

// Generate cryptographic nonce
const generateNonce = (): string => {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, "0")).join("");
};

// Simulated ECDSA signature (in production: device-bound private key via Web Crypto)
const signToken = async (payload: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray, b => b.toString(16).padStart(2, "0")).join("");
};

/**
 * Generate an offline payment token
 */
export const generateToken = async (
  amount: number,
  merchantId: string,
  merchantName: string
): Promise<OfflineToken> => {
  const deviceId = getDeviceId();
  const nonce = generateNonce();
  const timestamp = Date.now();
  const serialNumber = `TKN-${timestamp}-${nonce.slice(0, 8)}`;

  const payload = `${serialNumber}:${amount}:${merchantId}:${deviceId}:${nonce}:${timestamp}`;
  const signature = await signToken(payload);

  return {
    id: serialNumber,
    serialNumber,
    amount,
    merchantId,
    merchantName,
    deviceId,
    nonce,
    timestamp,
    expiresAt: timestamp + TOKEN_EXPIRY_MS,
    signature,
    spent: false,
  };
};

/**
 * Validate a token's integrity and expiry
 */
export const validateToken = async (token: OfflineToken): Promise<{ valid: boolean; reason?: string }> => {
  if (token.spent) return { valid: false, reason: "Token already spent" };
  if (Date.now() > token.expiresAt) return { valid: false, reason: "Token expired" };
  if (token.deviceId !== getDeviceId()) return { valid: false, reason: "Device mismatch" };

  // Re-sign and verify
  const payload = `${token.serialNumber}:${token.amount}:${token.merchantId}:${token.deviceId}:${token.nonce}:${token.timestamp}`;
  const expectedSig = await signToken(payload);
  if (expectedSig !== token.signature) return { valid: false, reason: "Invalid signature" };

  return { valid: true };
};

/**
 * IndexedDB-simulated token storage (uses localStorage for prototype)
 */
const STORAGE_KEY = "upix_offline_tokens";

export const storeToken = (token: OfflineToken): void => {
  const tokens = getStoredTokens();
  tokens.push(token);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
};

export const getStoredTokens = (): OfflineToken[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const markTokenSpent = (tokenId: string): void => {
  const tokens = getStoredTokens();
  const updated = tokens.map(t => t.id === tokenId ? { ...t, spent: true } : t);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getPendingTokens = (): OfflineToken[] => {
  return getStoredTokens().filter(t => !t.spent && Date.now() < t.expiresAt);
};

export const getExpiredTokens = (): OfflineToken[] => {
  return getStoredTokens().filter(t => !t.spent && Date.now() >= t.expiresAt);
};

export const clearExpiredTokens = (): number => {
  const tokens = getStoredTokens();
  const expired = tokens.filter(t => !t.spent && Date.now() >= t.expiresAt);
  const remaining = tokens.filter(t => t.spent || Date.now() < t.expiresAt);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
  return expired.length;
};
