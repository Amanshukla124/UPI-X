import { useState } from "react";
import { Clock, ArrowDownLeft, ArrowUpRight, Search, WifiOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTransactions, type Transaction } from "@/contexts/TransactionContext";

const History = () => {
  const { transactions } = useTransactions();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "pending" | "failed">("all");

  const filtered = transactions.filter(tx => {
    if (filter !== "all" && tx.status !== filter) return false;
    if (search && !tx.merchantName.toLowerCase().includes(search.toLowerCase()) && !tx.id.includes(search)) return false;
    return true;
  });

  return (
    <div className="flex flex-col p-4 gap-4">
      <header className="pt-2">
        <h1 className="text-2xl font-bold">Transaction History</h1>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by merchant or ID…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex gap-2">
        {(["all", "completed", "pending", "failed"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Clock className="h-10 w-10 mb-2 opacity-40" />
          <p className="text-sm">{transactions.length === 0 ? "No transactions yet" : "No matching transactions"}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(tx => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </div>
      )}
    </div>
  );
};

const TransactionRow = ({ tx }: { tx: Transaction }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
    <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
      tx.status === "completed" ? "bg-accent/20"
      : tx.status === "pending" ? "bg-secondary/20"
      : "bg-destructive/20"
    }`}>
      {tx.status === "pending"
        ? <WifiOff className="h-4 w-4 text-secondary" />
        : tx.status === "completed"
          ? <ArrowUpRight className="h-4 w-4 text-accent" />
          : <ArrowDownLeft className="h-4 w-4 text-destructive" />
      }
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-medium truncate">{tx.merchantName}</p>
        {tx.type === "offline" && (
          <span className="text-[10px] bg-secondary/20 text-secondary px-1.5 rounded shrink-0">offline</span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{tx.timestamp.toLocaleString()}</p>
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
);

export default History;
