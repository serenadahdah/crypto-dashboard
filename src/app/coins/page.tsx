import { Suspense } from "react";
import AppCoinsTable from "@/components/app-coins-table";
import { AppTrendingCoins } from "@/components/app-trending-coins";

export default function CoinsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h2 className="text-lg font-semibold">Trending Coins</h2>
      <AppTrendingCoins />
      <h2 className="text-lg font-semibold mt-4">All Coins</h2>
      <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <AppCoinsTable />
        </Suspense>
      </div>
    </div>
  );
}
