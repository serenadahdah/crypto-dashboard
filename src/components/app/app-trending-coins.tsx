"use client";

import {
  useTrendingCoins,
  type TrendingCoin,
} from "@/hooks/queries/use-trending-coins";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingCoinCard } from "@/components/ui/trending-coin-card";

export function AppTrendingCoins() {
  const { data, isLoading, isError } = useTrendingCoins();

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hover">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-muted/50 rounded-xl p-4 flex flex-col gap-2 min-w-[180px]"
          >
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <h2 className="text-red-300">
        Trending coins are not available at the moment
      </h2>
    );
  }

  const trendingCoins = data.coins ?? [];

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hover">
      {trendingCoins.map((coin: TrendingCoin) => (
        <TrendingCoinCard key={coin.item.id} coin={coin.item} />
      ))}
    </div>
  );
}
