import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransactions } from "@/contexts/TransactionContext";

const PaymentConfirm = () => {
  const navigate = useNavigate();
  const { pendingPayment, confirmPayment, walletBalance, clearPendingPayment } = useTransactions();
  const [pin, setPin] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  if (!pendingPayment) {
    navigate("/scan-pay", { replace: true });
    return null;
  }

  const insufficientBalance = pendingPayment.amount > walletBalance;

  const handleConfirm = async () => {
    if (pin.length !== 4) { setError("Enter 4-digit PIN"); return; }
    setProcessing(true);
    setError("");
    const success = await confirmPayment();
    setProcessing(false);
    navigate(success ? "/transaction-success" : "/transaction-failed", { replace: true });
  };

  const handleCancel = () => {
    clearPendingPayment();
    navigate("/scan-pay", { replace: true });
  };

  return (
    <div className="flex flex-col p-4 gap-6 min-h-[80vh]">
      <header className="pt-2 text-center">
        <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-2" />
        <h1 className="text-xl font-bold">Confirm Payment</h1>
      </header>

      {/* Merchant Card */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
            <Store className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div>
            <p className="font-semibold">{pendingPayment.merchantName}</p>
            <p className="text-xs text-muted-foreground">{pendingPayment.merchantId}</p>
          </div>
        </div>
        <div className="border-t border-border pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-bold text-lg">₹{pendingPayment.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-muted-foreground">Wallet Balance</span>
            <span className={insufficientBalance ? "text-destructive" : ""}>₹{walletBalance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {insufficientBalance ? (
        <p className="text-destructive text-sm text-center">Insufficient wallet balance</p>
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-medium">Enter UPI PIN</label>
          <Input
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="••••"
            value={pin}
            onChange={e => { setPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }}
            className="text-center text-2xl tracking-[0.5em] h-14"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <p className="text-xs text-muted-foreground text-center">Any 4-digit PIN works for this prototype</p>
        </div>
      )}

      <div className="flex gap-2 mt-auto">
        <Button variant="outline" onClick={handleCancel} className="flex-1" disabled={processing}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} className="flex-1" disabled={processing || insufficientBalance}>
          {processing ? "Processing…" : "Pay Now"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentConfirm;
