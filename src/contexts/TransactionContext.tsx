import React, { createContext, useContext, useState, useCallback } from "react";

export interface Transaction {
  id: string;
  merchantName: string;
  merchantId: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  type: "online" | "offline";
  timestamp: Date;
  note?: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  pendingPayment: PendingPayment | null;
  walletBalance: number;
  initPayment: (merchant: { name: string; id: string }, amount: number) => void;
  confirmPayment: () => Promise<boolean>;
  clearPendingPayment: () => void;
  addMoney: (amount: number) => void;
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

const TransactionContext = createContext<TransactionContextType | null>(null);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null);
  const [walletBalance, setWalletBalance] = useState(5000);

  const initPayment = useCallback((merchant: { name: string; id: string }, amount: number) => {
    setPendingPayment({ merchantName: merchant.name, merchantId: merchant.id, amount });
  }, []);

  const confirmPayment = useCallback(async (): Promise<boolean> => {
    if (!pendingPayment) return false;
    if (pendingPayment.amount > walletBalance) return false;

    await new Promise(r => setTimeout(r, 1500));

    // 90% success rate simulation
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

  const clearPendingPayment = useCallback(() => setPendingPayment(null), []);

  const addMoney = useCallback((amount: number) => {
    setWalletBalance(prev => prev + amount);
  }, []);

  return (
    <TransactionContext.Provider value={{ transactions, pendingPayment, walletBalance, initPayment, confirmPayment, clearPendingPayment, addMoney }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error("useTransactions must be used within TransactionProvider");
  return ctx;
};
