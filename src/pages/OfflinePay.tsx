import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wifi, WifiOff, Radio, Bluetooth, ShieldCheck, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useTransactions, MOCK_MERCHANT_LIST, isValidMerchant, getMerchantName } from "@/contexts/TransactionContext";
import { useConnectivity } from "@/hooks/useConnectivity";
import { transferToken, type ConnectionMethod, type ConnectionEvent } from "@/services/connectivityService";

type Step = "merchant" | "amount" | "method" | "transfer" | "result";

const OfflinePay = () => {
  const navigate = useNavigate();
  const { initPayment, confirmOfflinePayment, walletBalance, offlineBalance, clearPendingPayment } = useTransactions();
  const { isOnline } = useConnectivity();

  const [step, setStep] = useState<Step>("merchant");
  const [merchantId, setMerchantId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<ConnectionMethod>("nfc");
  const [connectionEvent, setConnectionEvent] = useState<ConnectionEvent | null>(null);
  const [transferSuccess, setTransferSuccess] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  const maxOfflineRemaining = 5000 - offlineBalance;

  const handleMerchantNext = () => {
    if (!merchantId || !isValidMerchant(merchantId)) {
      setError("Select a valid merchant");
      return;
    }
    setError("");
    setStep("amount");
  };

  const handleAmountNext = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError("Enter a valid amount"); return; }
    if (amt > 2000) { setError("Max ₹2,000 per offline transaction"); return; }
    if (amt > walletBalance) { setError("Insufficient wallet balance"); return; }
    if (amt > maxOfflineRemaining) { setError(`Offline limit remaining: ₹${maxOfflineRemaining.toFixed(0)}`); return; }
    setError("");
    initPayment({ name: getMerchantName(merchantId), id: merchantId }, amt);
    setStep("method");
  };

  const handleTransfer = async () => {
    setStep("transfer");
    setTransferSuccess(null);

    // Generate offline token
    const token = await confirmOfflinePayment();
    if (!token) {
      setTransferSuccess(false);
      setConnectionEvent({ status: "failed", method, message: "Token generation failed" });
      return;
    }

    // Simulate NFC/Bluetooth transfer
    const success = await transferToken(method, setConnectionEvent);
    setTransferSuccess(success);
    setStep("result");
  };

  const handleDone = () => {
    clearPendingPayment();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex flex-col min-h-[80vh] p-4">
      {/* Header */}
      <header className="flex items-center gap-2 pt-2 mb-6">
        <WifiOff className="h-5 w-5 text-secondary" />
        <h1 className="text-xl font-bold">Offline Payment</h1>
        {!isOnline && (
          <span className="ml-auto text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">Offline Mode</span>
        )}
      </header>

      {/* Step: Merchant */}
      {step === "merchant" && (
        <div className="flex-1 space-y-4">
          <p className="text-sm text-muted-foreground">Select merchant to pay offline</p>
          <div className="grid grid-cols-2 gap-2">
            {MOCK_MERCHANT_LIST.map(m => (
              <button
                key={m.id}
                onClick={() => { setMerchantId(m.id); setError(""); }}
                className={`p-3 rounded-xl border text-left text-sm transition-colors ${
                  merchantId === m.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                <span className="font-medium block">{m.name}</span>
                <span className="text-xs opacity-60">{m.id}</span>
              </button>
            ))}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleMerchantNext} className="w-full mt-4">Continue</Button>
        </div>
      )}

      {/* Step: Amount */}
      {step === "amount" && (
        <div className="flex-1 space-y-4">
          <div className="rounded-xl border border-border bg-card p-3 text-sm">
            <span className="text-muted-foreground">Paying: </span>
            <span className="font-semibold">{getMerchantName(merchantId)}</span>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (₹)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => { setAmount(e.target.value); setError(""); }}
              className="text-2xl h-14 font-bold"
              min={1}
              max={2000}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Max ₹2,000/txn</span>
              <span>Offline limit: ₹{maxOfflineRemaining.toFixed(0)} left</span>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep("merchant")} className="flex-1">Back</Button>
            <Button onClick={handleAmountNext} className="flex-1">Continue</Button>
          </div>
        </div>
      )}

      {/* Step: Connection Method */}
      {step === "method" && (
        <div className="flex-1 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="text-3xl font-bold">₹{parseFloat(amount).toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-1">{getMerchantName(merchantId)}</p>
          </div>

          <p className="text-sm font-medium">Choose transfer method</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMethod("nfc")}
              className={`flex flex-col items-center gap-2 p-5 rounded-xl border transition-colors ${
                method === "nfc"
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card"
              }`}
            >
              <Radio className={`h-8 w-8 ${method === "nfc" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-sm font-medium">NFC Tap</span>
              <span className="text-xs text-muted-foreground">Hold near terminal</span>
            </button>
            <button
              onClick={() => setMethod("bluetooth")}
              className={`flex flex-col items-center gap-2 p-5 rounded-xl border transition-colors ${
                method === "bluetooth"
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card"
              }`}
            >
              <Bluetooth className={`h-8 w-8 ${method === "bluetooth" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-sm font-medium">Bluetooth</span>
              <span className="text-xs text-muted-foreground">Nearby pairing</span>
            </button>
          </div>

          <div className="flex gap-2 mt-auto pt-4">
            <Button variant="outline" onClick={() => { clearPendingPayment(); setStep("amount"); }} className="flex-1">Back</Button>
            <Button onClick={handleTransfer} className="flex-1">
              <ShieldCheck className="h-4 w-4 mr-1" /> Pay Offline
            </Button>
          </div>
        </div>
      )}

      {/* Step: Transfer Progress */}
      {step === "transfer" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            {method === "nfc"
              ? <Radio className="h-8 w-8 text-primary animate-pulse" />
              : <Bluetooth className="h-8 w-8 text-primary animate-pulse" />
            }
          </div>
          <div>
            <p className="text-lg font-semibold">
              {method === "nfc" ? "NFC Transfer" : "Bluetooth Transfer"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {connectionEvent?.message || "Initializing…"}
            </p>
          </div>
          <Progress value={connectionEvent?.progress || 0} className="w-3/4 h-2" />
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Step: Result */}
      {step === "result" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
          {transferSuccess ? (
            <>
              <div className="h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Token Delivered!</h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-[280px]">
                  Payment token sent to {getMerchantName(merchantId)}. It will settle when you're back online.
                </p>
              </div>
              <div className="w-full rounded-xl border border-border bg-card p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold">₹{parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-secondary font-medium">Pending Settlement</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="capitalize">{method}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="h-20 w-20 rounded-full bg-destructive/20 flex items-center justify-center">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Transfer Failed</h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-[280px]">
                  Token was generated but delivery failed. It remains in your wallet for retry.
                </p>
              </div>
            </>
          )}
          <Button onClick={handleDone} className="w-full mt-4">Done</Button>
        </div>
      )}
    </div>
  );
};

export default OfflinePay;
