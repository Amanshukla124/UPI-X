/**
 * NFC & Bluetooth Connectivity Simulation
 * Simulates device-to-device token transfer for offline payments.
 */

export type ConnectionMethod = "nfc" | "bluetooth";
export type ConnectionStatus = "idle" | "scanning" | "connecting" | "connected" | "transferring" | "complete" | "failed";

export interface ConnectionEvent {
  status: ConnectionStatus;
  method: ConnectionMethod;
  message: string;
  progress?: number;
}

// Simulated NFC tap — fast connection
const simulateNFC = async (onEvent: (e: ConnectionEvent) => void): Promise<boolean> => {
  const steps: { status: ConnectionStatus; message: string; delay: number; progress?: number }[] = [
    { status: "scanning", message: "Hold device near merchant terminal…", delay: 800 },
    { status: "connecting", message: "NFC handshake…", delay: 600, progress: 25 },
    { status: "connected", message: "Secure channel established", delay: 400, progress: 50 },
    { status: "transferring", message: "Transmitting payment token…", delay: 1000, progress: 75 },
    { status: "complete", message: "Token delivered successfully", delay: 300, progress: 100 },
  ];

  for (const step of steps) {
    await new Promise(r => setTimeout(r, step.delay));
    onEvent({ status: step.status, method: "nfc", message: step.message, progress: step.progress });
  }

  // 95% NFC success rate
  return Math.random() > 0.05;
};

// Simulated Bluetooth — slightly slower
const simulateBluetooth = async (onEvent: (e: ConnectionEvent) => void): Promise<boolean> => {
  const steps: { status: ConnectionStatus; message: string; delay: number; progress?: number }[] = [
    { status: "scanning", message: "Scanning for nearby devices…", delay: 1200 },
    { status: "connecting", message: "Pairing via Bluetooth LE…", delay: 1000, progress: 20 },
    { status: "connected", message: "ECDH key exchange complete", delay: 800, progress: 45 },
    { status: "transferring", message: "Encrypting & sending token…", delay: 1200, progress: 70 },
    { status: "complete", message: "Token received by merchant", delay: 500, progress: 100 },
  ];

  for (const step of steps) {
    await new Promise(r => setTimeout(r, step.delay));
    onEvent({ status: step.status, method: "bluetooth", message: step.message, progress: step.progress });
  }

  // 90% Bluetooth success rate
  return Math.random() > 0.1;
};

/**
 * Initiate token transfer to merchant device
 */
export const transferToken = async (
  method: ConnectionMethod,
  onEvent: (e: ConnectionEvent) => void
): Promise<boolean> => {
  onEvent({ status: "idle", method, message: "Initializing…" });

  const success = method === "nfc"
    ? await simulateNFC(onEvent)
    : await simulateBluetooth(onEvent);

  if (!success) {
    onEvent({ status: "failed", method, message: "Transfer failed — please try again" });
  }

  return success;
};
