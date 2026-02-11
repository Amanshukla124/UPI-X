import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Smartphone, Shield, Wifi } from "lucide-react";

const Splash = () => {
  const { state, goToStep } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.isAuthenticated) {
        navigate("/", { replace: true });
      } else {
        goToStep("onboarding");
        navigate("/onboarding", { replace: true });
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [state.isAuthenticated, navigate, goToStep]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary p-6">
      {/* Animated logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, duration: 0.8 }}
        className="relative mb-8"
      >
        <div className="h-24 w-24 rounded-3xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center">
          <span className="text-4xl font-extrabold text-primary-foreground tracking-tight">UX</span>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-3xl font-extrabold text-primary-foreground mb-2"
      >
        UPI X
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-primary-foreground/70 text-sm text-center mb-10"
      >
        Secure Offline Payments
      </motion.p>

      {/* Feature pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="flex gap-3"
      >
        {[
          { icon: Wifi, label: "Offline" },
          { icon: Shield, label: "Secure" },
          { icon: Smartphone, label: "NFC" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1.5">
            <Icon className="h-3.5 w-3.5 text-primary-foreground/80" />
            <span className="text-xs text-primary-foreground/80 font-medium">{label}</span>
          </div>
        ))}
      </motion.div>

      {/* Loading bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "60%" }}
        transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
        className="h-1 rounded-full bg-primary-foreground/30 mt-12"
      />

      <p className="text-primary-foreground/40 text-[10px] mt-6">v1.0.0 Prototype</p>
    </div>
  );
};

export default Splash;
