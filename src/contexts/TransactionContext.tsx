import React, { createContext, useContext, useState, useCallback } from "react";
import { generateToken, storeToken, markTokenSpent, getPendingTokens, clearExpiredTokens, type OfflineToken } from "@/services/tokenEngine";

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
  syncOfflineTransactions: () => Promise<number>;
  refreshPendingTokens: () => void;
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

  // Sync offline transactions (simulate settlement)
  const syncOfflineTransactions = useCallback(async (): Promise<number> => {
    const tokens = getPendingTokens();
    if (tokens.length === 0) return 0;

    let settled = 0;
    for (const token of tokens) {
      await new Promise(r => setTimeout(r, 500));
      // 95% settlement success
      const success = Math.random() > 0.05;

      markTokenSpent(token.id);

      setTransactions(prev =>
        prev.map(tx =>
          tx.tokenId === token.id
            ? { ...tx, status: success ? "completed" : "failed" }
            : tx
        )
      );

      if (success) {
        settled++;
      } else {
        // Refund failed settlement
        setWalletBalance(prev => prev + token.amount);
      }
      setOfflineBalance(prev => Math.max(0, prev - token.amount));
    }

    refreshPendingTokens();
    return settled;
  }, [refreshPendingTokens]);

  const clearPendingPayment = useCallback(() => setPendingPayment(null), []);

  const addMoney = useCallback((amount: number) => {
    setWalletBalance(prev => prev + amount);
  }, []);

  return (
    <TransactionContext.Provider value={{
      transactions, pendingPayment, walletBalance, offlineBalance, pendingTokens,
      initPayment, confirmPayment, confirmOfflinePayment, clearPendingPayment,
      addMoney, syncOfflineTransactions, refreshPendingTokens
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
