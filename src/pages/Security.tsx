import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Fingerprint, Smartphone, Clock, AlertTriangle, CheckCircle2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  isPinSet, setPin, verifyPin, clearPin,
  getLockTimeout, setLockTimeout,
  runTamperCheck, getLastTamperReport,
  getLoginHistory, getDeviceFingerprint,
  type TamperReport, type LoginEntry,
} from "@/services/securityService";
import { getDeviceId } from "@/services/tokenEngine";
import { toast } from "sonner";

const TIMEOUT_OPTIONS = [
  { label: "1 minute", ms: 60_000 },
  { label: "5 minutes", ms: 300_000 },
  { label: "15 minutes", ms: 900_000 },
  { label: "30 minutes", ms: 1_800_000 },
];

const Security = () => {
  const navigate = useNavigate();
  const [pinEnabled, setPinEnabled] = useState(isPinSet());
  const [showPinForm, setShowPinForm] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [currentTimeout, setCurrentTimeout] = useState(getLockTimeout());
  const [tamperReport, setTamperReport] = useState<TamperReport | null>(getLastTamperReport());
  const [loginHistory, setLoginHistory] = useState<LoginEntry[]>(getLoginHistory());
  const [showHistory, setShowHistory] = useState(false);
  const deviceFingerprint = getDeviceFingerprint();
  const deviceId = getDeviceId();

  useEffect(() => {
    const report = runTamperCheck();
    setTamperReport(report);
  }, []);

  const handleSetPin = async () => {
    if (newPin.length !== 4) { toast.error("PIN must be 4 digits"); return; }
    if (newPin !== confirmPin) { toast.error("PINs don't match"); return; }
    await setPin(newPin);
    setPinEnabled(true);
    setShowPinForm(false);
    setNewPin("");
    setConfirmPin("");
    toast.success("PIN set successfully");
  };

  const handleDisablePin = () => {
    clearPin();
    setPinEnabled(false);
    toast.success("PIN disabled");
  };

  const handleTimeoutChange = (ms: number) => {
    setLockTimeout(ms);
    setCurrentTimeout(ms);
  };

  return (
    <div className="flex flex-col p-4 gap-5 pb-24">
      <header className="flex items-center gap-3 pt-2">
        <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-lg bg-card flex items-center justify-center">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold">Security</h1>
      </header>

      {/* Tamper Status */}
      {tamperReport && (
        <section className={`rounded-xl p-4 border ${tamperReport.safe ? "border-accent bg-accent/10" : "border-destructive bg-destructive/10"}`}>
          <div className="flex items-center gap-2 mb-2">
            {tamperReport.safe ? <CheckCircle2 className="h-5 w-5 text-accent" /> : <AlertTriangle className="h-5 w-5 text-destructive" />}
            <p className="font-semibold text-sm">{tamperReport.safe ? "Device Secure" : "Security Warning"}</p>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>Root/Jailbreak: {tamperReport.rooted ? "⚠️ Detected" : "✅ Clean"}</p>
            <p>Debugger: {tamperReport.debuggerAttached ? "⚠️ Attached" : "✅ None"}</p>
            <p>App Signature: {tamperReport.signatureMismatch ? "⚠️ Mismatch" : "✅ Valid"}</p>
          </div>
        </section>
      )}

      {/* PIN Settings */}
      <section className="rounded-xl border border-border bg-card p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">App Lock PIN</p>
              <p className="text-xs text-muted-foreground">Require PIN after inactivity</p>
            </div>
          </div>
          <Switch
            checked={pinEnabled}
            onCheckedChange={(checked) => {
              if (checked) setShowPinForm(true);
              else handleDisablePin();
            }}
          />
        </div>

        {showPinForm && (
          <div className="space-y-3 pt-2 border-t border-border">
            <Input
              type="password" inputMode="numeric" maxLength={4} placeholder="New PIN (4 digits)"
              value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              className="text-center tracking-[0.3em]"
            />
            <Input
              type="password" inputMode="numeric" maxLength={4} placeholder="Confirm PIN"
              value={confirmPin} onChange={e => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              className="text-center tracking-[0.3em]"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { setShowPinForm(false); setNewPin(""); setConfirmPin(""); }} className="flex-1">Cancel</Button>
              <Button size="sm" onClick={handleSetPin} className="flex-1">Set PIN</Button>
            </div>
          </div>
        )}
      </section>

      {/* Biometric (placeholder) */}
      <section className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Fingerprint className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Biometric Unlock</p>
              <p className="text-xs text-muted-foreground">Coming soon — requires native app</p>
            </div>
          </div>
          <Switch disabled />
        </div>
      </section>

      {/* Auto-Lock Timeout */}
      {pinEnabled && (
        <section className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-3 mb-1">
            <Clock className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium">Auto-Lock Timeout</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TIMEOUT_OPTIONS.map(opt => (
              <button
                key={opt.ms}
                onClick={() => handleTimeoutChange(opt.ms)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  currentTimeout === opt.ms ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Device Info */}
      <section className="rounded-xl border border-border bg-card p-4 space-y-2">
        <div className="flex items-center gap-3 mb-1">
          <Smartphone className="h-5 w-5 text-primary" />
          <p className="text-sm font-medium">Device Binding</p>
        </div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>Device ID: <span className="font-mono">{deviceId.slice(0, 16)}…</span></p>
          <p>Platform: {deviceFingerprint.platform}</p>
          <p>Screen: {deviceFingerprint.screenRes}</p>
          <p>Timezone: {deviceFingerprint.timezone}</p>
        </div>
      </section>

      {/* Login History */}
      <section className="rounded-xl border border-border bg-card p-4">
        <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-3 w-full">
          <History className="h-5 w-5 text-primary" />
          <p className="text-sm font-medium flex-1 text-left">Login History</p>
          <span className="text-xs text-muted-foreground">{loginHistory.length} entries</span>
        </button>
        {showHistory && loginHistory.length > 0 && (
          <div className="mt-3 space-y-2 border-t border-border pt-3 max-h-48 overflow-y-auto">
            {loginHistory.slice(0, 10).map((entry, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</span>
                <span className="capitalize font-medium">{entry.method}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Security;
