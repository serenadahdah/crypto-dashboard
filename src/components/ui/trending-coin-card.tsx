import type { TrendingCoinItem } from "@/hooks/queries/use-trending-coins";

interface TrendingCoinCardProps {
  coin: TrendingCoinItem;
}

export function TrendingCoinCard({ coin }: TrendingCoinCardProps) {
  return (
    <div className="bg-muted/50 rounded-xl p-4 flex flex-col gap-2 min-w-[180px] shrink-0">
      <div className="flex items-center gap-2">
        <img
          src={coin.thumb}
          alt={coin.name ?? ""}
          width={20}
          height={20}
          className="rounded-full"
        />
        <span className="font-medium text-sm truncate">{coin.name}</span>
        <span className="text-muted-foreground text-xs">
          {coin.symbol?.toUpperCase()}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold">
          $
          {coin.data?.price?.toLocaleString(undefined, {
            maximumFractionDigits: 6,
          }) ?? "N/A"}
        </span>
        <span
          className={`text-xs ${
            (coin.data?.price_change_percentage_24h?.usd ?? 0) >= 0
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {(coin.data?.price_change_percentage_24h?.usd ?? 0).toFixed(2)}%
        </span>
      </div>
      <span className="text-xs text-muted-foreground">
        Rank #{coin.market_cap_rank ?? "N/A"}
      </span>
    </div>
  );
}
