import { Clock } from "lucide-react";

const History = () => {
  return (
    <div className="flex flex-col p-4 gap-6">
      <header className="pt-2">
        <h1 className="text-2xl font-bold">Transaction History</h1>
      </header>

      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <Clock className="h-10 w-10 mb-2 opacity-40" />
        <p className="text-sm">No transactions to show</p>
      </div>
    </div>
  );
};

export default History;
