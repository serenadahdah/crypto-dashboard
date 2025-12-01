import { usePaginationParams } from "@/hooks/use-pagination-params";
import { useTableSorting } from "@/hooks/use-table-sorting";
import { COIN_GECKO_CLIENT, type Coin } from "@/lib/coin-gecko";
import { QUERY_KEYS } from "@/lib/query-keys";
import { type ApiSortValue, type SortValue } from "@/types/sorting";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const DEFAULT_API_SORT: ApiSortValue = "market_cap_desc";

const sortArray = <T>(
  array: T[],
  key: keyof T,
  ascending: boolean = true,
): T[] => {
  return array.sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (typeof aValue !== "number" || typeof bValue !== "number") return 0;

    if (aValue < bValue) return ascending ? -1 : 1;
    if (aValue > bValue) return ascending ? 1 : -1;
    return 0;
  });
};

const getApiSortOrder = (sort: SortValue): ApiSortValue => {
  switch (sort) {
    case "market_cap_desc":
    case "market_cap_asc":
    case "volume_desc":
    case "volume_asc":
      return sort;
    case "price_desc":
    case "price_asc":
    case "change_24h_desc":
    case "change_24h_asc":
      return DEFAULT_API_SORT;
    default:
      sort satisfies never;
      return DEFAULT_API_SORT;
  }
};

const applyFrontendSort = (coins: Coin[], sort: SortValue): Coin[] => {
  const result = [...coins];

  switch (sort) {
    case "market_cap_desc":
    case "market_cap_asc":
    case "volume_desc":
    case "volume_asc":
      return result;
    case "price_desc":
      return sortArray(result, "current_price", false);
    case "price_asc":
      return sortArray(result, "current_price", true);
    case "change_24h_desc":
      return sortArray(result, "price_change_percentage_24h", false);
    case "change_24h_asc":
      return sortArray(result, "price_change_percentage_24h", true);
    default:
      sort satisfies never;
      return result;
  }
};

export const useCoins = () => {
  const { page, pageSize } = usePaginationParams();
  const { currentSort } = useTableSorting();

  const apiSortOrder = getApiSortOrder(currentSort);

  const query = useQuery({
    queryKey: [QUERY_KEYS.COINS, page, pageSize, apiSortOrder],
    queryFn: () =>
      COIN_GECKO_CLIENT.coins.markets.get({
        vs_currency: "usd",
        page,
        per_page: pageSize,
        order: apiSortOrder,
      }),
    placeholderData: keepPreviousData,
    refetchInterval: 60 * 1000,
    select: (data) => applyFrontendSort(data, currentSort),
  });

  return query;
};
