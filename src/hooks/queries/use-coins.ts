import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";
import { COIN_GECKO_CLIENT } from "@/lib/coin-gecko";
import { type PaginationParams } from "@/types/pagination";

export const useCoins = ({ page = 1, per_page = 20 }: PaginationParams = {}) =>
  useQuery({
    queryKey: [QUERY_KEYS.COINS, page, per_page],
    queryFn: () =>
      COIN_GECKO_CLIENT.coins.markets.get({
        vs_currency: "usd",
        page,
        per_page,
      }),
    placeholderData: keepPreviousData,
    refetchInterval: 60 * 1000, // Refetch every 60 seconds
  });

