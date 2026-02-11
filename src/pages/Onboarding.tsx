import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Shield, Smartphone, QrCode, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    icon: WifiOff,
    title: "Pay Without Internet",
    description: "Make secure payments even when you're offline. Your money moves with digital tokens that work anywhere.",
    color: "bg-primary",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Every transaction is protected with end-to-end encryption and tamper-proof digital tokens. Your money is always safe.",
    color: "bg-accent",
  },
  {
    icon: Smartphone,
    title: "Tap & Pay with NFC",
    description: "Just tap your phone to pay. Works with NFC and Bluetooth for instant contactless transactions.",
    color: "bg-secondary",
  },
  {
    icon: QrCode,
    title: "Scan Any QR Code",
    description: "Pay any merchant by scanning their UPI QR code. Works with all major payment platforms in India.",
    color: "bg-primary",
  },
];

const Onboarding = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();

  const isLast = current === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      completeOnboarding();
      navigate("/phone-verify", { replace: true });
    } else {
      setCurrent(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    navigate("/phone-verify", { replace: true });
  };

  const slide = slides[current];

  return (
    <div className="min-h-screen flex flex-col bg-background safe-top">
      {/* Skip button */}
      <div className="flex justify-end p-4">
        {!isLast && (
          <button onClick={handleSkip} className="text-sm text-muted-foreground font-medium px-3 py-1">
            Skip
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <div className={`h-28 w-28 rounded-3xl ${slide.color} flex items-center justify-center mb-8`}>
              <slide.icon className="h-14 w-14 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">{slide.title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-[300px]">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots & CTA */}
      <div className="flex flex-col items-center gap-6 p-8 pb-12">
        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-primary" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>

        <Button onClick={handleNext} className="w-full h-14 text-base font-semibold rounded-xl gap-2">
          {isLast ? "Get Started" : "Next"}
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
