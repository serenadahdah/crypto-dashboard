import { TokenBalanceChecker } from "@/components/token-balance-checker";
import { SendEthForm } from "@/components/send-eth-form";

export default function WalletPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Wallet</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <SendEthForm />
        <TokenBalanceChecker />
      </div>
    </div>
  );
}
