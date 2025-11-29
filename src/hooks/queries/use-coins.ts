import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";
import { COIN_GECKO_CLIENT } from "@/lib/coin-gecko";


export const useCoins = () => useQuery({
    queryKey: [QUERY_KEYS.COINS],
    queryFn: () => COIN_GECKO_CLIENT.coins.markets.get({ vs_currency: 'usd' }),
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
});

