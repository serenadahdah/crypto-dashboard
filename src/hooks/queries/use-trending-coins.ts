import { useQuery } from "@tanstack/react-query";
import { COIN_GECKO_CLIENT } from "@/lib/coin-gecko";
import { QUERY_KEYS } from "@/lib/query-keys";
import type Coingecko from "@coingecko/coingecko-typescript";

// the actual API response wraps each coin in an "item" object
export type TrendingCoinItem = Coingecko.Search.TrendingGetResponse.Coin;
export type TrendingCoin = { item: TrendingCoinItem };

export const useTrendingCoins = () =>
    useQuery({
        queryKey: [QUERY_KEYS.TRENDING_COINS],
        queryFn: () => COIN_GECKO_CLIENT.search.trending.get() as Promise<{
            coins?: TrendingCoin[];
            categories?: Coingecko.Search.TrendingGetResponse.Category[];
            nfts?: Coingecko.Search.TrendingGetResponse.NFT[];
        }>,
        refetchInterval: 60 * 1000, // 60 seconds
    });
