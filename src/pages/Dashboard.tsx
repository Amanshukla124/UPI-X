import { useNavigate } from "react-router-dom";
import { Wallet, Send, QrCode, WifiOff, RefreshCw, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTransactions } from "@/contexts/TransactionContext";
import { useAutoSync } from "@/hooks/useAutoSync";
import { useConnectivity } from "@/hooks/useConnectivity";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { transactions, walletBalance, offlineBalance, pendingTokens, syncOfflineTransactions, lastSyncReport } = useTransactions();
  const { isOnline, simulatedOffline, toggleSimulatedOffline } = useConnectivity();
  const [syncing, setSyncing] = useState(false);

  // Auto-sync on connectivity restoration
  const { syncStatus, progress, triggerSync } = useAutoSync((report) => {
    // Force refresh after auto-sync completes — context already updated via syncOfflineTransactions
  });

  const recent = transactions.slice(0, 5);

  const handleSync = async () => {
    setSyncing(true);
    await syncOfflineTransactions();
    setSyncing(false);
  };

  const isSyncing = syncing || syncStatus === "syncing";

  return (
    <div className="flex flex-col p-4 gap-6">
      {/* Header */}
      <header className="flex items-center justify-between pt-2">
        <div>
          <p className="text-sm text-muted-foreground">Good morning</p>
          <h1 className="text-2xl font-bold">UPI X</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSimulatedOffline}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
              isOnline
                ? "bg-accent/20 text-accent"
                : "bg-secondary/20 text-secondary"
            }`}
          >
            {isOnline ? (
              <><span className="h-2 w-2 rounded-full bg-accent" />Online</>
            ) : (
              <><WifiOff className="h-3 w-3" />Offline</>
            )}
          </button>
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">U</span>
          </div>
        </div>
      </header>

      {/* Balance Card */}
      <section className="rounded-xl bg-primary p-5 text-primary-foreground">
        <p className="text-sm opacity-80">Wallet Balance</p>
        <p className="text-3xl font-bold mt-1">₹{walletBalance.toFixed(2)}</p>
        {offlineBalance > 0 && (
          <div className="flex items-center gap-2 mt-2 text-xs opacity-80">
            <Clock className="h-3 w-3" />
            <span>₹{offlineBalance.toFixed(0)} pending offline settlement</span>
          </div>
        )}
      </section>

      {/* Auto-Sync Progress Banner */}
      {isSyncing && (
        <section className="rounded-xl border border-primary bg-primary/10 p-4 space-y-2 animate-fade-in">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-primary animate-spin" />
            <p className="text-sm font-semibold">Syncing offline payments…</p>
          </div>
          <Progress value={progress.total > 0 ? (progress.settled / progress.total) * 100 : 0} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {progress.settled} of {progress.total} settled
          </p>
        </section>
      )}

      {/* Sync Complete Banner */}
      {!isSyncing && lastSyncReport && lastSyncReport.total > 0 && (
        <section className="rounded-xl border border-accent bg-accent/10 p-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            <p className="text-sm font-semibold">Sync Complete</p>
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="text-accent font-medium">{lastSyncReport.settled} settled</span>
            {lastSyncReport.failed > 0 && (
              <span className="text-destructive font-medium">{lastSyncReport.failed} failed</span>
            )}
            {lastSyncReport.expired > 0 && (
              <span className="text-secondary font-medium">{lastSyncReport.expired} expired</span>
            )}
          </div>
        </section>
      )}

      {/* Pending Sync Banner */}
      {!isSyncing && pendingTokens.length > 0 && isOnline && (
        <section className="rounded-xl border border-secondary bg-secondary/10 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">{pendingTokens.length} offline payment{pendingTokens.length > 1 ? "s" : ""}</p>
            <p className="text-xs text-muted-foreground">Ready to settle</p>
          </div>
          <Button size="sm" onClick={handleSync} disabled={isSyncing} className="gap-1">
            <RefreshCw className="h-4 w-4" />
            Sync Now
          </Button>
        </section>
      )}

      {/* Offline Pending (when offline) */}
      {!isOnline && pendingTokens.length > 0 && (
        <section className="rounded-xl border border-muted bg-muted/50 p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-secondary shrink-0" />
          <div>
            <p className="text-sm font-semibold">{pendingTokens.length} pending payment{pendingTokens.length > 1 ? "s" : ""}</p>
            <p className="text-xs text-muted-foreground">Will auto-sync when you're back online</p>
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="grid grid-cols-3 gap-3">
        {isOnline ? (
          [
            { icon: QrCode, label: "Scan & Pay", color: "bg-primary", route: "/scan-pay" },
            { icon: Send, label: "Send", color: "bg-secondary", route: "/scan-pay" },
            { icon: Wallet, label: "Add Money", color: "bg-accent", route: "/wallet" },
          ].map(({ icon: Icon, label, color, route }) => (
            <button
              key={label}
              onClick={() => navigate(route)}
              className={`flex flex-col items-center gap-2 rounded-xl ${color} p-4 text-primary-foreground transition-transform active:scale-95`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))
        ) : (
          [
            { icon: WifiOff, label: "Pay Offline", color: "bg-secondary", route: "/offline-pay" },
            { icon: QrCode, label: "Scan & Pay", color: "bg-muted", route: "/scan-pay" },
            { icon: Wallet, label: "Wallet", color: "bg-muted", route: "/wallet" },
          ].map(({ icon: Icon, label, color, route }) => (
            <button
              key={label}
              onClick={() => navigate(route)}
              className={`flex flex-col items-center gap-2 rounded-xl ${color} p-4 ${
                color === "bg-secondary" ? "text-secondary-foreground" : "text-muted-foreground"
              } transition-transform active:scale-95`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))
        )}
      </section>

      {/* Recent Transactions */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          {recent.length > 0 && (
            <button onClick={() => navigate("/history")} className="text-xs text-primary font-medium">
              View All
            </button>
          )}
        </div>
        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <Wallet className="h-10 w-10 mb-2 opacity-40" />
            <p className="text-sm">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                <div>
                  <p className="text-sm font-medium">{tx.merchantName}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-muted-foreground">{tx.timestamp.toLocaleString()}</p>
                    {tx.type === "offline" && (
                      <span className="text-[10px] bg-secondary/20 text-secondary px-1.5 rounded">offline</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${
                    tx.status === "completed" ? "text-accent"
                    : tx.status === "pending" ? "text-secondary"
                    : "text-destructive"
                  }`}>
                    ₹{tx.amount.toFixed(2)}
                  </p>
                  <p className={`text-xs capitalize ${
                    tx.status === "completed" ? "text-accent"
                    : tx.status === "pending" ? "text-secondary"
                    : "text-destructive"
                  }`}>
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
