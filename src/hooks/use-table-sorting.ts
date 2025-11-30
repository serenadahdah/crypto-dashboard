import { useState } from "react";

export type SortField = "market_cap" | "volume";
export type SortDirection = "asc" | "desc";
export type ApiSortOrder = "market_cap_desc" | "market_cap_asc" | "volume_desc" | "volume_asc";

export interface SortOption {
    field: SortField;
    direction: SortDirection;
}

const toApiSortOrder = (sort: SortOption): ApiSortOrder => {
    return `${sort.field}_${sort.direction}` as const;
};

export const useTableSorting = (callback?: () => void) => {
    const [sortField, setSortField] = useState<SortField>("market_cap");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const sort = toApiSortOrder({ field: sortField, direction: sortDirection });

    const setSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "desc" ? "asc" : "desc");
        } else {
            setSortField(field);
            setSortDirection("desc");
        }
        if (callback) {
            callback();
        }
    };

    return { sort, setSort, sortField, sortDirection };

}