import React, { createContext, useContext, useState, useCallback } from "react";
import { generateToken, storeToken, markTokenSpent, getPendingTokens, clearExpiredTokens, type OfflineToken } from "@/services/tokenEngine";
import { runFullSync, saveLastSyncReport, type SyncReport } from "@/services/syncEngine";

export interface Transaction {
  id: string;
  merchantName: string;
  merchantId: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  type: "online" | "offline";
  timestamp: Date;
  tokenId?: string;
  note?: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  pendingPayment: PendingPayment | null;
  walletBalance: number;
  offlineBalance: number;
  pendingTokens: OfflineToken[];
  initPayment: (merchant: { name: string; id: string }, amount: number) => void;
  confirmPayment: () => Promise<boolean>;
  confirmOfflinePayment: () => Promise<OfflineToken | null>;
  clearPendingPayment: () => void;
  addMoney: (amount: number) => void;
  syncOfflineTransactions: () => Promise<SyncReport>;
  refreshPendingTokens: () => void;
  lastSyncReport: SyncReport | null;
}

interface PendingPayment {
  merchantName: string;
  merchantId: string;
  amount: number;
}

const MOCK_MERCHANTS: Record<string, string> = {
  "MERCHANT001": "Chai Corner",
  "MERCHANT002": "Fresh Veggies Store",
  "MERCHANT003": "Quick Repairs",
  "MERCHANT004": "City Pharmacy",
  "MERCHANT005": "Street Bites",
};

export const getMerchantName = (id: string) => MOCK_MERCHANTS[id] || "Unknown Merchant";
export const isValidMerchant = (id: string) => id in MOCK_MERCHANTS;
export const MOCK_MERCHANT_LIST = Object.entries(MOCK_MERCHANTS).map(([id, name]) => ({ id, name }));

const MAX_OFFLINE_BALANCE = 5000;

const TransactionContext = createContext<TransactionContextType | null>(null);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null);
  const [walletBalance, setWalletBalance] = useState(5000);
  const [offlineBalance, setOfflineBalance] = useState(0);
  const [pendingTokens, setPendingTokens] = useState<OfflineToken[]>(() => getPendingTokens());
  const [lastSyncReport, setLastSyncReport] = useState<SyncReport | null>(null);

  const refreshPendingTokens = useCallback(() => {
    clearExpiredTokens();
    setPendingTokens(getPendingTokens());
  }, []);

  const initPayment = useCallback((merchant: { name: string; id: string }, amount: number) => {
    setPendingPayment({ merchantName: merchant.name, merchantId: merchant.id, amount });
  }, []);

  // Online payment
  const confirmPayment = useCallback(async (): Promise<boolean> => {
    if (!pendingPayment) return false;
    if (pendingPayment.amount > walletBalance) return false;

    await new Promise(r => setTimeout(r, 1500));
    const success = Math.random() > 0.1;

    const tx: Transaction = {
      id: `TXN${Date.now()}`,
      merchantName: pendingPayment.merchantName,
      merchantId: pendingPayment.merchantId,
      amount: pendingPayment.amount,
      status: success ? "completed" : "failed",
      type: "online",
      timestamp: new Date(),
    };

    setTransactions(prev => [tx, ...prev]);
    if (success) {
      setWalletBalance(prev => prev - pendingPayment.amount);
    }
    return success;
  }, [pendingPayment, walletBalance]);

  // Offline payment — generate token and deduct balance immediately
  const confirmOfflinePayment = useCallback(async (): Promise<OfflineToken | null> => {
    if (!pendingPayment) return null;
    if (pendingPayment.amount > walletBalance) return null;

    const newOfflineTotal = offlineBalance + pendingPayment.amount;
    if (newOfflineTotal > MAX_OFFLINE_BALANCE) return null;

    const token = await generateToken(
      pendingPayment.amount,
      pendingPayment.merchantId,
      pendingPayment.merchantName
    );

    storeToken(token);

    const tx: Transaction = {
      id: `TXN${Date.now()}`,
      merchantName: pendingPayment.merchantName,
      merchantId: pendingPayment.merchantId,
      amount: pendingPayment.amount,
      status: "pending",
      type: "offline",
      timestamp: new Date(),
      tokenId: token.id,
    };

    setTransactions(prev => [tx, ...prev]);
    setWalletBalance(prev => prev - pendingPayment.amount);
    setOfflineBalance(prev => prev + pendingPayment.amount);
    refreshPendingTokens();

    return token;
  }, [pendingPayment, walletBalance, offlineBalance, refreshPendingTokens]);

  // Full sync with retry engine
  const syncOfflineTransactions = useCallback(async (): Promise<SyncReport> => {
    const report = await runFullSync();

    saveLastSyncReport(report);
    setLastSyncReport(report);

    // Update transaction statuses based on results
    for (const result of report.results) {
      setTransactions(prev =>
        prev.map(tx =>
          tx.tokenId === result.tokenId
            ? { ...tx, status: result.success ? "completed" : "failed", note: result.reason }
            : tx
        )
      );

      // Refund failed/expired settlements
      if (!result.success) {
        setWalletBalance(prev => prev + result.amount);
      }
      setOfflineBalance(prev => Math.max(0, prev - result.amount));
    }

    refreshPendingTokens();
    return report;
  }, [refreshPendingTokens]);

  const clearPendingPayment = useCallback(() => setPendingPayment(null), []);

  const addMoney = useCallback((amount: number) => {
    setWalletBalance(prev => prev + amount);
  }, []);

  return (
    <TransactionContext.Provider value={{
      transactions, pendingPayment, walletBalance, offlineBalance, pendingTokens,
      initPayment, confirmPayment, confirmOfflinePayment, clearPendingPayment,
      addMoney, syncOfflineTransactions, refreshPendingTokens, lastSyncReport
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error("useTransactions must be used within TransactionProvider");
  return ctx;
};
