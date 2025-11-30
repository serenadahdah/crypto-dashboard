"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface UsePaginationParamsProps {
    defaultPage?: number;
    defaultPageSize?: number;
    PAGE_PARAM?: string;
    PAGE_SIZE_PARAM?: string;
}

const PAGE_PARAM = "page";
const PAGE_SIZE_PARAM = "page_size";

export const INITIAL_PAGE_SIZE = 20;
export const INITIAL_PAGE = 1;

export function usePaginationParams({
    defaultPage = INITIAL_PAGE,
    defaultPageSize = INITIAL_PAGE_SIZE,
}: UsePaginationParamsProps = {}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = Number(searchParams.get(PAGE_PARAM)) || defaultPage;
    const pageSize = Number(searchParams.get(PAGE_SIZE_PARAM)) || defaultPageSize;
    const hasPreviousPage = page > 1;

    const _createQueryString = (params: Record<string, string | number | null>) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());

        for (const [key, value] of Object.entries(params)) {
            if (value === null) {
                newSearchParams.delete(key);
            } else {
                newSearchParams.set(key, String(value));
            }
        }

        return newSearchParams.toString();
    };

    const _updateParams = (params: Record<string, string | number | null>) => {
        const queryString = _createQueryString(params);
        router.push(`?${queryString}`, { scroll: false });
    };

    const goToPage = (pageNumber: number) => {
        const validPage = Math.max(1, pageNumber);
        _updateParams({
            [PAGE_PARAM]: validPage === defaultPage ? null : validPage,
        });
    };

    const nextPage = () => {
        goToPage(page + 1);
    };

    const previousPage = () => {
        goToPage(page - 1);
    };

    const changePageSize = (newPageSize: number) => {
        _updateParams({
            [PAGE_SIZE_PARAM]: newPageSize === defaultPageSize ? null : newPageSize,
            [PAGE_PARAM]: null,
        });
    };

    return {
        page,
        pageSize,
        hasPreviousPage,
        goToPage,
        nextPage,
        previousPage,
        changePageSize,
    };
}
