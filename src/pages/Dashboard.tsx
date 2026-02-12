import { useNavigate } from "react-router-dom";
import { Wallet, Send, QrCode } from "lucide-react";
import { useTransactions } from "@/contexts/TransactionContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { transactions, walletBalance } = useTransactions();
  const recent = transactions.slice(0, 5);

  return (
    <div className="flex flex-col p-4 gap-6">
      {/* Header */}
      <header className="flex items-center justify-between pt-2">
        <div>
          <p className="text-sm text-muted-foreground">Good morning</p>
          <h1 className="text-2xl font-bold">UPI X</h1>
        </div>
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground text-sm font-bold">U</span>
        </div>
      </header>

      {/* Balance Card */}
      <section className="rounded-xl bg-primary p-5 text-primary-foreground">
        <p className="text-sm opacity-80">Wallet Balance</p>
        <p className="text-3xl font-bold mt-1">₹{walletBalance.toFixed(2)}</p>
        <div className="flex items-center gap-1 mt-2">
          <span className="inline-block h-2 w-2 rounded-full bg-upi-green" />
          <span className="text-xs opacity-80">Online</span>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-3 gap-3">
        {[
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
        ))}
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
                  <p className="text-xs text-muted-foreground">{tx.timestamp.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.status === "completed" ? "text-accent" : "text-destructive"}`}>
                    {tx.status === "completed" ? "-" : ""}₹{tx.amount.toFixed(2)}
                  </p>
                  <p className={`text-xs capitalize ${tx.status === "completed" ? "text-accent" : "text-destructive"}`}>
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
