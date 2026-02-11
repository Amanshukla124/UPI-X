import { ScanLine } from "lucide-react";

const ScanPay = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 gap-4">
      <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
        <ScanLine className="h-10 w-10 text-primary" />
      </div>
      <h1 className="text-xl font-bold">Scan & Pay</h1>
      <p className="text-sm text-muted-foreground text-center max-w-[280px]">
        Point your camera at a merchant QR code to make a payment
      </p>
    </div>
  );
};

export default ScanPay;
