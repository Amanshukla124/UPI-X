import { Wallet as WalletIcon } from "lucide-react";

const Wallet = () => {
  return (
    <div className="flex flex-col p-4 gap-6">
      <header className="pt-2">
        <h1 className="text-2xl font-bold">Wallet</h1>
      </header>

      <section className="rounded-xl bg-primary p-5 text-primary-foreground">
        <p className="text-sm opacity-80">Available Balance</p>
        <p className="text-3xl font-bold mt-1">₹0.00</p>
      </section>

      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <WalletIcon className="h-10 w-10 mb-2 opacity-40" />
        <p className="text-sm">Wallet features coming soon</p>
      </div>
    </div>
  );
};

export default Wallet;
