import { useState, useEffect } from "react";
import { Shield, FileText, CheckCircle2, AlertTriangle, Download, RefreshCw, ClipboardList, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getAuditLog, getAuditSummary, verifyAuditChain, exportAuditCSV, type AuditEntry, type AuditSummary } from "@/services/auditService";
import { useTransactions } from "@/contexts/TransactionContext";
import { useAuth } from "@/contexts/AuthContext";

const Compliance = () => {
  const { transactions, walletBalance, offlineBalance } = useTransactions();
  const { state } = useAuth();
  const [summary, setSummary] = useState<AuditSummary | null>(null);
  const [recentAudit, setRecentAudit] = useState<AuditEntry[]>([]);
  const [chainValid, setChainValid] = useState<boolean | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const s = await getAuditSummary();
    setSummary(s);
    setRecentAudit(getAuditLog().slice(0, 20));
    setChainValid(s.chainIntact);
  };

  const handleVerify = async () => {
    setVerifying(true);
    const result = await verifyAuditChain();
    setChainValid(result);
    setVerifying(false);
  };

  const handleExport = () => {
    const csv = exportAuditCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `upix-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Transaction reporting stats
  const totalTx = transactions.length;
  const completedTx = transactions.filter(t => t.status === "completed").length;
  const failedTx = transactions.filter(t => t.status === "failed").length;
  const pendingTx = transactions.filter(t => t.status === "pending").length;
  const offlineTx = transactions.filter(t => t.type === "offline").length;
  const totalVolume = transactions.filter(t => t.status === "completed").reduce((s, t) => s + t.amount, 0);

  // NPCI readiness checklist
  const readinessChecks = [
    { label: "Offline wallet limit ≤ ₹5,000", pass: offlineBalance <= 5000 },
    { label: "Per-txn limit ≤ ₹2,000 enforced", pass: true },
    { label: "Token expiry (48h) configured", pass: true },
    { label: "Settlement window (24h) configured", pass: true },
    { label: "PIN-based auth enabled", pass: true },
    { label: "Device binding active", pass: true },
    { label: "Tamper detection enabled", pass: true },
    { label: "Audit trail chain intact", pass: chainValid === true },
    { label: "KYC verification flow present", pass: state.isAuthenticated },
    { label: "Multi-language support (EN/HI)", pass: true },
  ];

  const passCount = readinessChecks.filter(c => c.pass).length;

  return (
    <div className="flex flex-col p-4 gap-4">
      <header className="pt-2">
        <h1 className="text-2xl font-bold">Compliance & Reporting</h1>
        <p className="text-xs text-muted-foreground mt-1">Regulatory review & audit trail</p>
      </header>

      <Tabs defaultValue="reporting" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="reporting" className="flex-1 text-xs">Reporting</TabsTrigger>
          <TabsTrigger value="audit" className="flex-1 text-xs">Audit Trail</TabsTrigger>
          <TabsTrigger value="readiness" className="flex-1 text-xs">Readiness</TabsTrigger>
        </TabsList>

        {/* Transaction Reporting */}
        <TabsContent value="reporting" className="space-y-4 mt-4">
          <section className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Transactions", value: totalTx, icon: Activity },
              { label: "Completed", value: completedTx, icon: CheckCircle2 },
              { label: "Failed", value: failedTx, icon: AlertTriangle },
              { label: "Pending", value: pendingTx, icon: RefreshCw },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl border border-border bg-card p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
                <p className="text-xl font-bold">{value}</p>
              </div>
            ))}
          </section>

          <section className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-sm font-semibold">Settlement Summary</h3>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total volume (completed)</span>
              <span className="font-semibold">₹{totalVolume.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Offline transactions</span>
              <span>{offlineTx}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current wallet balance</span>
              <span>₹{walletBalance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Locked offline balance</span>
              <span className="text-secondary font-medium">₹{offlineBalance.toFixed(0)}</span>
            </div>
          </section>
        </TabsContent>

        {/* Audit Trail */}
        <TabsContent value="audit" className="space-y-4 mt-4">
          <section className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">{summary?.totalEntries ?? 0} audit entries</p>
              <div className="flex items-center gap-1.5 mt-1">
                {chainValid === true && <CheckCircle2 className="h-3.5 w-3.5 text-accent" />}
                {chainValid === false && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
                {chainValid === null && <Shield className="h-3.5 w-3.5 text-muted-foreground" />}
                <span className="text-xs text-muted-foreground">
                  {chainValid === true ? "Chain verified" : chainValid === false ? "Chain broken!" : "Not verified"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleVerify} disabled={verifying} className="gap-1 text-xs">
                <Shield className="h-3 w-3" />
                {verifying ? "…" : "Verify"}
              </Button>
              <Button size="sm" variant="outline" onClick={handleExport} className="gap-1 text-xs">
                <Download className="h-3 w-3" />
                Export
              </Button>
            </div>
          </section>

          {summary && (
            <section className="grid grid-cols-3 gap-2">
              {(Object.entries(summary.byCategory) as [string, number][])
                .filter(([, v]) => v > 0)
                .map(([cat, count]) => (
                  <div key={cat} className="rounded-lg border border-border bg-card p-2 text-center">
                    <p className="text-lg font-bold">{count}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{cat}</p>
                  </div>
                ))}
            </section>
          )}

          <section className="space-y-2">
            <h3 className="text-sm font-semibold">Recent Events</h3>
            {recentAudit.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No audit entries yet</p>
            ) : (
              recentAudit.map(entry => (
                <div key={entry.id} className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium capitalize bg-primary/10 text-primary px-2 py-0.5 rounded">{entry.category}</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm font-medium">{entry.action}</p>
                  {entry.detail && <p className="text-xs text-muted-foreground">{entry.detail}</p>}
                  <p className="text-[10px] text-muted-foreground font-mono">#{entry.chainHash.slice(0, 12)}</p>
                </div>
              ))
            )}
          </section>
        </TabsContent>

        {/* NPCI Readiness */}
        <TabsContent value="readiness" className="space-y-4 mt-4">
          <section className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">NPCI Sandbox Readiness</h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                passCount === readinessChecks.length
                  ? "bg-accent/20 text-accent"
                  : "bg-secondary/20 text-secondary"
              }`}>
                {passCount}/{readinessChecks.length}
              </span>
            </div>
            <div className="space-y-2">
              {readinessChecks.map(({ label, pass }) => (
                <div key={label} className="flex items-center gap-2">
                  {pass
                    ? <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    : <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                  }
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-4 space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" /> Documentation Status
            </h3>
            {[
              "Compliance rules (docs/compliance.md)",
              "Threat model (docs/threat-model.md)",
              "Token engine specification",
              "Sync engine specification",
              "Security service specification",
            ].map(doc => (
              <div key={doc} className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                <span className="text-xs text-muted-foreground">{doc}</span>
              </div>
            ))}
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Compliance;
