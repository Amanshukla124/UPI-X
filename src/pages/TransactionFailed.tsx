import { useNavigate } from "react-router-dom";
import { XCircle, RotateCcw, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

const TransactionFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 gap-6 text-center">
      <div className="h-20 w-20 rounded-full bg-destructive/20 flex items-center justify-center">
        <XCircle className="h-12 w-12 text-destructive" />
      </div>

      <div>
        <h1 className="text-2xl font-bold">Payment Failed</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-[280px]">
          The transaction could not be completed. No money was deducted from your wallet.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full mt-4">
        <Button onClick={() => navigate("/scan-pay", { replace: true })} className="w-full gap-2">
          <RotateCcw className="h-4 w-4" /> Try Again
        </Button>
        <Button variant="outline" onClick={() => navigate("/", { replace: true })} className="w-full">
          Back to Home
        </Button>
        <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
          <Headphones className="h-4 w-4" /> Contact Support
        </Button>
      </div>
    </div>
  );
};

export default TransactionFailed;
