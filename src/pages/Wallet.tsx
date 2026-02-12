import { useState } from "react";
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransactions } from "@/contexts/TransactionContext";

const Wallet = () => {
  const { walletBalance, transactions, addMoney } = useTransactions();
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState("");

  const handleAddMoney = () => {
    const amt = parseFloat(addAmount);
    if (amt > 0 && amt <= 10000) {
      addMoney(amt);
      setAddAmount("");
      setShowAddMoney(false);
    }
  };

  const recentWalletTx = transactions.slice(0, 5);

  return (
    <div className="flex flex-col p-4 gap-6">
      <header className="pt-2">
        <h1 className="text-2xl font-bold">Wallet</h1>
      </header>

      {/* Balance Card */}
      <section className="rounded-xl bg-primary p-5 text-primary-foreground">
        <p className="text-sm opacity-80">Available Balance</p>
        <p className="text-3xl font-bold mt-1">₹{walletBalance.toFixed(2)}</p>
        <div className="flex gap-2 mt-4">
          <Button
            variant="secondary"
            size="sm"
            className="gap-1"
            onClick={() => setShowAddMoney(!showAddMoney)}
          >
            <Plus className="h-4 w-4" /> Add Money
          </Button>
        </div>
      </section>

      {/* Add Money Form */}
      {showAddMoney && (
        <section className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h3 className="text-sm font-semibold">Add Money to Wallet</h3>
          <div className="flex gap-2">
            {[100, 500, 1000, 2000].map(amt => (
              <button
                key={amt}
                onClick={() => setAddAmount(String(amt))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  addAmount === String(amt)
                    ? "border-primary bg-primary/10"
                    : "border-border"
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
          <Input
            type="number"
            placeholder="Enter amount"
            value={addAmount}
            onChange={e => setAddAmount(e.target.value)}
            className="h-12 text-lg"
            max={10000}
          />
          <p className="text-xs text-muted-foreground">Max ₹10,000 (simulated)</p>
          <Button onClick={handleAddMoney} className="w-full" disabled={!addAmount || parseFloat(addAmount) <= 0}>
            Add ₹{addAmount || "0"}
          </Button>
        </section>
      )}

      {/* Spending Limits */}
      <section className="rounded-xl border border-border bg-card p-4 space-y-2">
        <h3 className="text-sm font-semibold">Limits</h3>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Per transaction (offline)</span>
          <span>₹2,000</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Offline wallet cap</span>
          <span>₹5,000</span>
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h3 className="text-sm font-semibold mb-2">Recent Activity</h3>
        {recentWalletTx.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <WalletIcon className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-sm">No activity yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentWalletTx.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  tx.status === "completed" ? "bg-accent/20" : "bg-destructive/20"
                }`}>
                  {tx.status === "completed"
                    ? <ArrowUpRight className="h-4 w-4 text-accent" />
                    : <ArrowDownLeft className="h-4 w-4 text-destructive" />
                  }
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{tx.merchantName}</p>
                </div>
                <p className={`text-sm font-bold ${tx.status === "completed" ? "text-accent" : "text-destructive"}`}>
                  ₹{tx.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Wallet;
