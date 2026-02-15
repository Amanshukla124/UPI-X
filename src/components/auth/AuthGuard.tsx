import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isPinSet, isSessionLocked, updateLastActivity } from "@/services/securityService";
import PinLockScreen from "@/components/security/PinLockScreen";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAuth();
  const [locked, setLocked] = useState(() => isPinSet() && isSessionLocked());

  // Track activity to reset lock timer
  useEffect(() => {
    if (!locked) {
      updateLastActivity();
      const handler = () => updateLastActivity();
      window.addEventListener("pointerdown", handler);
      return () => window.removeEventListener("pointerdown", handler);
    }
  }, [locked]);

  // Check lock periodically
  useEffect(() => {
    if (!isPinSet()) return;
    const interval = setInterval(() => {
      if (isSessionLocked()) setLocked(true);
    }, 10_000);
    return () => clearInterval(interval);
  }, []);

  if (!state.isAuthenticated) {
    return <Navigate to="/splash" replace />;
  }

  if (locked) {
    return <PinLockScreen onUnlock={() => setLocked(false)} />;
  }

  return <>{children}</>;
};

export default AuthGuard;
