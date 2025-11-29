import { useQuery } from "@tanstack/react-query";
import { getFromCoinGecko } from "@/lib/endpoints";
import { QUERY_KEYS } from "@/lib/query-keys";

import type { Coin } from "@/types/coin";

export const useCoins = () => useQuery({
    queryKey: [QUERY_KEYS.COINS],
    queryFn: () => getFromCoinGecko<Coin[]>('coins/markets?vs_currency=usd'),
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
});

