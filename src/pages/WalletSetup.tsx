import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, CreditCard, Smartphone, CheckCircle2, IndianRupee } from "lucide-react";

type FundingSource = "upi" | "card" | "upi-lite";

const fundingSources: { id: FundingSource; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: "upi", label: "UPI", desc: "Link your bank account via UPI", icon: <Smartphone className="h-5 w-5" /> },
  { id: "card", label: "Debit / Credit Card", desc: "Add funds using your card", icon: <CreditCard className="h-5 w-5" /> },
  { id: "upi-lite", label: "UPI Lite", desc: "Small value offline payments", icon: <Wallet className="h-5 w-5" /> },
];

const WalletSetup = () => {
  const { completeWalletSetup } = useAuth();
  const [selected, setSelected] = useState<FundingSource | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSetup = () => {
    if (!selected) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col safe-top">
      <div className="flex-1 flex flex-col px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Setup Wallet</h1>
              <p className="text-sm text-muted-foreground">Choose how you'd like to add money</p>
            </div>
          </div>
        </motion.div>

        {/* Balance preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl bg-primary p-5 text-primary-foreground mb-6"
        >
          <p className="text-sm opacity-80">Wallet Balance</p>
          <div className="flex items-baseline gap-1 mt-1">
            <IndianRupee className="h-6 w-6" />
            <span className="text-3xl font-bold">0.00</span>
          </div>
          <p className="text-xs opacity-60 mt-2">Offline limit: ₹5,000 · Per txn: ₹2,000</p>
        </motion.div>

        {!done ? (
          <>
            {/* Funding sources */}
            <p className="text-sm font-medium text-muted-foreground mb-3">Select funding source</p>
            <div className="flex flex-col gap-3">
              {fundingSources.map((src, i) => (
                <motion.div
                  key={src.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card
                    className={`cursor-pointer transition-all border-2 ${
                      selected === src.id
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:border-muted-foreground/20"
                    }`}
                    onClick={() => setSelected(src.id)}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className={`${selected === src.id ? "text-primary" : "text-muted-foreground"}`}>
                        {src.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{src.label}</p>
                        <p className="text-xs text-muted-foreground">{src.desc}</p>
                      </div>
                      {selected === src.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Regulatory notice */}
            <div className="mt-4 rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                As per RBI guidelines, minimum KYC wallets are limited to ₹10,000. Complete full KYC to unlock ₹1,00,000.
              </p>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-4"
          >
            <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-accent" />
            </div>
            <p className="text-xl font-bold">Wallet Ready!</p>
            <p className="text-sm text-muted-foreground text-center">
              Your wallet has been configured. You can add money anytime from the Wallet tab.
            </p>
          </motion.div>
        )}

        {/* Bottom action */}
        <div className="mt-auto pt-6">
          {done ? (
            <Button className="w-full h-12 text-base font-semibold" onClick={completeWalletSetup}>
              Go to Dashboard
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <Button
                className="w-full h-12 text-base font-semibold"
                disabled={!selected || loading}
                onClick={handleSetup}
              >
                {loading ? "Setting up..." : "Setup Wallet"}
              </Button>
              <Button variant="ghost" className="w-full text-muted-foreground" onClick={completeWalletSetup}>
                Skip for now
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletSetup;
