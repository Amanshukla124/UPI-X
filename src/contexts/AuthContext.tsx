import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type AuthStep = "splash" | "onboarding" | "phone-verify" | "otp-verify" | "kyc-setup" | "wallet-setup" | "authenticated";

interface AuthState {
  step: AuthStep;
  phone: string;
  isAuthenticated: boolean;
}

interface AuthContextType {
  state: AuthState;
  setPhone: (phone: string) => void;
  completeOnboarding: () => void;
  sendOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  completeKyc: () => void;
  completeWalletSetup: () => void;
  logout: () => void;
  goToStep: (step: AuthStep) => void;
}

const AUTH_STORAGE_KEY = "upix_auth";

const getInitialState = (): AuthState => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.isAuthenticated) {
        return { step: "authenticated", phone: parsed.phone || "", isAuthenticated: true };
      }
    }
  } catch {}
  return { step: "splash", phone: "", isAuthenticated: false };
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(getInitialState);

  useEffect(() => {
    if (state.isAuthenticated) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ isAuthenticated: true, phone: state.phone }));
    }
  }, [state.isAuthenticated, state.phone]);

  const setPhone = useCallback((phone: string) => {
    setState(prev => ({ ...prev, phone }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setState(prev => ({ ...prev, step: "phone-verify" }));
  }, []);

  const sendOtp = useCallback(async (phone: string): Promise<boolean> => {
    // Simulated OTP send — always succeeds after a short delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setState(prev => ({ ...prev, phone, step: "otp-verify" }));
    console.log(`[MOCK] OTP sent to ${phone}: 123456`);
    return true;
  }, []);

  const verifyOtp = useCallback(async (otp: string): Promise<boolean> => {
    // Simulated OTP verification — accepts "123456" or any 6-digit code
    await new Promise(resolve => setTimeout(resolve, 600));
    if (otp.length === 6) {
      setState(prev => ({ ...prev, step: "kyc-setup" }));
      return true;
    }
    return false;
  }, [state.phone]);

  const completeKyc = useCallback(() => {
    setState(prev => ({ ...prev, step: "wallet-setup" }));
  }, []);

  const completeWalletSetup = useCallback(() => {
    setState({ step: "authenticated", phone: state.phone, isAuthenticated: true });
  }, [state.phone]);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setState({ step: "onboarding", phone: "", isAuthenticated: false });
  }, []);

  const goToStep = useCallback((step: AuthStep) => {
    setState(prev => ({ ...prev, step }));
  }, []);

  return (
    <AuthContext.Provider value={{ state, setPhone, completeOnboarding, sendOtp, verifyOtp, completeKyc, completeWalletSetup, logout, goToStep }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
