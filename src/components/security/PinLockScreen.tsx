import { useState } from "react";
import { ShieldCheck, Delete } from "lucide-react";
import { verifyPin, updateLastActivity, recordLogin } from "@/services/securityService";
import { motion, AnimatePresence } from "framer-motion";

interface PinLockScreenProps {
  onUnlock: () => void;
}

const PinLockScreen = ({ onUnlock }: PinLockScreenProps) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleDigit = async (digit: string) => {
    if (checking) return;
    const next = pin + digit;
    setError(false);

    if (next.length === 4) {
      setPin(next);
      setChecking(true);
      const valid = await verifyPin(next);
      if (valid) {
        updateLastActivity();
        recordLogin("pin");
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => { setPin(""); setChecking(false); }, 400);
      }
    } else {
      setPin(next);
    }
  };

  const handleDelete = () => {
    if (checking) return;
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-8">
        <ShieldCheck className="h-12 w-12 text-primary" />
        <div>
          <h2 className="text-xl font-bold text-center">Enter PIN</h2>
          <p className="text-sm text-muted-foreground text-center mt-1">Unlock UPI X to continue</p>
        </div>

        {/* PIN dots */}
        <div className="flex gap-4">
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              animate={error ? { x: [0, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.3 }}
              className={`h-4 w-4 rounded-full border-2 transition-colors ${
                i < pin.length
                  ? error ? "bg-destructive border-destructive" : "bg-primary border-primary"
                  : "border-muted-foreground/40"
              }`}
            />
          ))}
        </div>

        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-destructive">
              Incorrect PIN. Try again.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 w-64">
          {digits.map((d, i) => {
            if (d === "") return <div key={i} />;
            if (d === "del") {
              return (
                <button key={i} onClick={handleDelete} className="h-14 rounded-xl flex items-center justify-center text-muted-foreground active:bg-muted transition-colors">
                  <Delete className="h-5 w-5" />
                </button>
              );
            }
            return (
              <button
                key={i}
                onClick={() => handleDigit(d)}
                className="h-14 rounded-xl bg-card border border-border text-lg font-semibold active:bg-primary active:text-primary-foreground transition-colors"
              >
                {d}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground">Default PIN: 1234</p>
      </motion.div>
    </div>
  );
};

export default PinLockScreen;
