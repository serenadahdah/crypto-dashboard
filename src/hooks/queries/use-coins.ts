import { usePaginationParams } from "@/hooks/use-pagination-params";
import { COIN_GECKO_CLIENT } from "@/lib/coin-gecko";
import { QUERY_KEYS } from "@/lib/query-keys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useCoins = ({ order = "market_cap_desc" }: { order?: string } = {}) => {
  const { page, pageSize } = usePaginationParams();

  return useQuery({
    queryKey: [QUERY_KEYS.COINS, page, pageSize, order],
    queryFn: () =>
      COIN_GECKO_CLIENT.coins.markets.get({
        vs_currency: "usd",
        page,
        per_page: pageSize,
        order: order as "market_cap_desc" | "market_cap_asc" | "volume_asc" | "volume_desc",
      }),
    placeholderData: keepPreviousData,
    refetchInterval: 60 * 1000,
  });
}

