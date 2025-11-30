export type SortField = "market_cap" | "volume";
export type SortDirection = "asc" | "desc";
export type ApiSortOrder = "market_cap_desc" | "market_cap_asc" | "volume_desc" | "volume_asc";

export interface SortOption {
  field: SortField;
  direction: SortDirection;
}

export const toApiSortOrder = (sort: SortOption): ApiSortOrder => {
  return `${sort.field}_${sort.direction}` as ApiSortOrder;
};
