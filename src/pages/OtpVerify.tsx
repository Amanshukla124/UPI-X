import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const OtpVerify = () => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { state, verifyOtp, sendOtp } = useAuth();
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError("");

    // Auto-advance
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (digit && index === OTP_LENGTH - 1 && newOtp.every(d => d)) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (pasted.length > 0) {
      const newOtp = Array(OTP_LENGTH).fill("");
      pasted.split("").forEach((d, i) => { newOtp[i] = d; });
      setOtp(newOtp);
      if (pasted.length === OTP_LENGTH) {
        handleVerify(pasted);
      } else {
        inputRefs.current[pasted.length]?.focus();
      }
    }
  };

  const handleVerify = async (code: string) => {
    setLoading(true);
    setError("");
    try {
      const success = await verifyOtp(code);
      if (success) {
        navigate("/", { replace: true });
      } else {
        setError("Invalid OTP. Please try again.");
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setResendTimer(RESEND_SECONDS);
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    await sendOtp(state.phone);
    inputRefs.current[0]?.focus();
  };

  const maskedPhone = state.phone
    ? `${state.phone.slice(0, 4)}****${state.phone.slice(-2)}`
    : "";

  return (
    <div className="min-h-screen flex flex-col bg-background safe-top">
      <div className="p-4">
        <button onClick={() => navigate("/phone-verify", { replace: true })} className="text-sm text-muted-foreground">
          ← Change number
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pt-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 mx-auto">
            <ShieldCheck className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Verify OTP</h1>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to <span className="font-medium text-foreground">{maskedPhone}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1 italic">
            (Prototype: any 6-digit code works)
          </p>
        </motion.div>

        {/* OTP input boxes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-3 mb-6"
          onPaste={handlePaste}
        >
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className="h-14 w-11 rounded-xl border-2 border-border bg-card text-center text-xl font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          ))}
        </motion.div>

        {error && <p className="text-destructive text-sm mb-4">{error}</p>}

        {/* Resend */}
        <div className="text-sm text-muted-foreground">
          {resendTimer > 0 ? (
            <span>Resend code in <span className="font-medium text-foreground">{resendTimer}s</span></span>
          ) : (
            <button onClick={handleResend} className="text-primary font-medium">
              Resend OTP
            </button>
          )}
        </div>
      </div>

      {/* Verify button */}
      <div className="p-6 pb-10">
        <Button
          onClick={() => handleVerify(otp.join(""))}
          disabled={otp.some(d => !d) || loading}
          className="w-full h-14 text-base font-semibold rounded-xl gap-2"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Verify & Continue"
          )}
        </Button>
      </div>
    </div>
  );
};

export default OtpVerify;
