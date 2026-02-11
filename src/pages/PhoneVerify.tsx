import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Phone, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const PhoneVerify = () => {
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { sendOtp } = useAuth();
  const navigate = useNavigate();

  const isValid = /^[6-9]\d{9}$/.test(phone) && agreed;

  const handleSubmit = async () => {
    if (!isValid) return;
    setError("");
    setLoading(true);
    try {
      const success = await sendOtp(`+91${phone}`);
      if (success) {
        navigate("/otp-verify", { replace: true });
      }
    } catch {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background safe-top">
      <div className="p-4">
        <button onClick={() => navigate("/onboarding", { replace: true })} className="text-sm text-muted-foreground">
          ← Back
        </button>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <Phone className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Enter your phone number</h1>
          <p className="text-sm text-muted-foreground">
            We'll send you a one-time verification code via SMS
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col gap-4"
        >
          {/* Phone input */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 h-12 px-3 rounded-xl border border-border bg-muted/50 shrink-0">
              <span className="text-lg">🇮🇳</span>
              <span className="text-sm font-medium">+91</span>
            </div>
            <Input
              type="tel"
              inputMode="numeric"
              placeholder="Enter 10-digit number"
              maxLength={10}
              value={phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                setPhone(val);
                setError("");
              }}
              className="h-12 rounded-xl text-base"
              autoFocus
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          {/* Terms checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
              className="mt-0.5"
            />
            <span className="text-xs text-muted-foreground leading-relaxed">
              I agree to the <span className="text-primary font-medium">Terms of Service</span> and{" "}
              <span className="text-primary font-medium">Privacy Policy</span>. I understand this is a prototype application.
            </span>
          </label>
        </motion.div>
      </div>

      {/* Submit button */}
      <div className="p-6 pb-10">
        <Button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className="w-full h-14 text-base font-semibold rounded-xl gap-2"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Send OTP
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PhoneVerify;
