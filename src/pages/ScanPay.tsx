import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScanLine, Keyboard, Flashlight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_MERCHANT_LIST, getMerchantName, isValidMerchant, useTransactions } from "@/contexts/TransactionContext";

const ScanPay = () => {
  const navigate = useNavigate();
  const { initPayment } = useTransactions();
  const [mode, setMode] = useState<"scan" | "manual">("scan");
  const [merchantId, setMerchantId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleMerchantSelect = (id: string) => {
    setMerchantId(id);
    setError("");
  };

  const handleProceed = () => {
    if (!merchantId) { setError("Enter a merchant ID"); return; }
    if (!isValidMerchant(merchantId)) { setError("Invalid merchant ID"); return; }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError("Enter a valid amount"); return; }
    if (amt > 2000) { setError("Max ₹2,000 per transaction"); return; }

    initPayment({ name: getMerchantName(merchantId), id: merchantId }, amt);
    navigate("/payment-confirm");
  };

  const simulateScan = (id: string) => {
    setMerchantId(id);
    setMode("manual");
  };

  return (
    <div className="flex flex-col min-h-[80vh]">
      {mode === "scan" ? (
        <>
          {/* Simulated Camera View */}
          <div className="relative flex-1 bg-black/90 flex items-center justify-center min-h-[300px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-56 h-56 border-2 border-primary rounded-2xl relative">
                <div className="absolute -top-0.5 -left-0.5 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
                <div className="absolute -top-0.5 -right-0.5 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
                <div className="absolute -bottom-0.5 -left-0.5 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
                <div className="absolute -bottom-0.5 -right-0.5 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-2xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ScanLine className="h-8 w-8 text-primary animate-pulse" />
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="icon" className="text-white">
                <Flashlight className="h-5 w-5" />
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white text-center text-sm mb-3">Point camera at QR code</p>
              <Button variant="secondary" className="w-full" onClick={() => setMode("manual")}>
                <Keyboard className="h-4 w-4 mr-2" />
                Enter Manually
              </Button>
            </div>
          </div>

          {/* Mock QR buttons for simulation */}
          <div className="p-4 space-y-2">
            <p className="text-xs text-muted-foreground text-center">Simulate scanning a merchant QR:</p>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_MERCHANT_LIST.slice(0, 4).map(m => (
                <Button key={m.id} variant="outline" size="sm" onClick={() => simulateScan(m.id)} className="text-xs">
                  {m.name}
                </Button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 p-4 space-y-5">
          <header className="pt-2">
            <h1 className="text-2xl font-bold">Pay Merchant</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter merchant details and amount</p>
          </header>

          {/* Merchant selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Merchant</label>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_MERCHANT_LIST.map(m => (
                <button
                  key={m.id}
                  onClick={() => handleMerchantSelect(m.id)}
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
          </div>

          {/* Amount */}
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
            <p className="text-xs text-muted-foreground">Max ₹2,000 per transaction</p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setMode("scan")} className="flex-1">
              Back to Scan
            </Button>
            <Button onClick={handleProceed} className="flex-1">
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanPay;
