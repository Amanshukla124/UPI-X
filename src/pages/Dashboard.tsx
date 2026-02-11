import { Wallet, Send, QrCode } from "lucide-react";

const Dashboard = () => {
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
        <p className="text-3xl font-bold mt-1">₹0.00</p>
        <div className="flex items-center gap-1 mt-2">
          <span className="inline-block h-2 w-2 rounded-full bg-upi-green" />
          <span className="text-xs opacity-80">Online</span>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { icon: QrCode, label: "Scan & Pay", color: "bg-primary" },
          { icon: Send, label: "Send", color: "bg-secondary" },
          { icon: Wallet, label: "Add Money", color: "bg-accent" },
        ].map(({ icon: Icon, label, color }) => (
          <button
            key={label}
            className={`flex flex-col items-center gap-2 rounded-xl ${color} p-4 text-primary-foreground transition-transform active:scale-95`}
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </section>

      {/* Recent Transactions */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Recent Transactions</h2>
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <Wallet className="h-10 w-10 mb-2 opacity-40" />
          <p className="text-sm">No transactions yet</p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
