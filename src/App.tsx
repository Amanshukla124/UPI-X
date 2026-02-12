import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AuthGuard from "./components/auth/AuthGuard";
import MobileLayout from "./components/layout/MobileLayout";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import PhoneVerify from "./pages/PhoneVerify";
import OtpVerify from "./pages/OtpVerify";
import Dashboard from "./pages/Dashboard";
import ScanPay from "./pages/ScanPay";
import Wallet from "./pages/Wallet";
import History from "./pages/History";
import Menu from "./pages/Menu";
import KycSetup from "./pages/KycSetup";
import WalletSetup from "./pages/WalletSetup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public auth flow */}
            <Route path="/splash" element={<Splash />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/phone-verify" element={<PhoneVerify />} />
            <Route path="/otp-verify" element={<OtpVerify />} />
            <Route path="/kyc-setup" element={<KycSetup />} />
            <Route path="/wallet-setup" element={<WalletSetup />} />

            {/* Protected app routes */}
            <Route element={<AuthGuard><MobileLayout /></AuthGuard>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/scan-pay" element={<ScanPay />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/history" element={<History />} />
              <Route path="/menu" element={<Menu />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
