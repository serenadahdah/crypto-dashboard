
export type ApiSortValue =
  | "market_cap_desc"
  | "market_cap_asc"
  | "volume_desc"
  | "volume_asc";

export type SortValue =
  | ApiSortValue
  | "price_desc"
  | "price_asc"
  | "change_24h_desc"
  | "change_24h_asc";

export const DEFAULT_SORT: SortValue = "market_cap_desc";
