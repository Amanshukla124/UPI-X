import { useNavigate } from "react-router-dom";
import { CheckCircle2, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/contexts/TransactionContext";

const TransactionSuccess = () => {
  const navigate = useNavigate();
  const { transactions } = useTransactions();
  const lastTx = transactions[0];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 gap-6 text-center">
      <div className="h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center">
        <CheckCircle2 className="h-12 w-12 text-accent" />
      </div>

      <div>
        <h1 className="text-2xl font-bold">Payment Successful!</h1>
        {lastTx && (
          <p className="text-3xl font-bold mt-2">₹{lastTx.amount.toFixed(2)}</p>
        )}
      </div>

      {lastTx && (
        <div className="w-full rounded-xl border border-border bg-card p-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">To</span>
            <span className="font-medium">{lastTx.merchantName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Transaction ID</span>
            <span className="font-mono text-xs">{lastTx.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time</span>
            <span>{lastTx.timestamp.toLocaleTimeString()}</span>
          </div>
        </div>
      )}

      <div className="flex gap-3 w-full">
        <Button variant="outline" size="sm" className="flex-1 gap-1">
          <Share2 className="h-4 w-4" /> Share
        </Button>
        <Button variant="outline" size="sm" className="flex-1 gap-1">
          <Download className="h-4 w-4" /> Receipt
        </Button>
      </div>

      <Button onClick={() => navigate("/", { replace: true })} className="w-full">
        Done
      </Button>
    </div>
  );
};

export default TransactionSuccess;
