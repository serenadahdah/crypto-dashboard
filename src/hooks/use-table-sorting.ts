"use client";
import { useSearchParamsState } from "./use-search-params-state";
import { type SortValue, DEFAULT_SORT } from "@/types/sorting";

const SORT_PARAM = "sort";

interface UseTableSortingParams {
    defaultSort?: SortValue;
}

const isValidSortValue = (value: string | null): value is SortValue => {
    if (!value) return false;
    const validSorts: SortValue[] = [
        "market_cap_desc",
        "market_cap_asc",
        "volume_desc",
        "volume_asc",
        "price_desc",
        "price_asc",
        "change_24h_desc",
        "change_24h_asc",
    ];
    return validSorts.includes(value as SortValue);
};

export const useTableSorting = ({
    defaultSort = DEFAULT_SORT,
}: UseTableSortingParams = {}) => {
    const { getParam, updateParams } = useSearchParamsState();

    const sortParam = getParam(SORT_PARAM);
    const currentSort: SortValue = isValidSortValue(sortParam) ? sortParam : defaultSort;

    const setSort = (newSort: SortValue) => {
        updateParams({
            [SORT_PARAM]: newSort === defaultSort ? null : newSort,
        });
    };

    const resetSort = () => {
        updateParams({
            [SORT_PARAM]: null,
            page: null,
        });
    };

    return {
        currentSort,
        setSort,
        resetSort,
    };
};