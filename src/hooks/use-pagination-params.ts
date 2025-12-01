"use client";

import { useSearchParamsState } from "./use-search-params-state";

const PAGE_PARAM = "page";
const PAGE_SIZE_PARAM = "page_size";

export const INITIAL_PAGE_SIZE = 20;
export const INITIAL_PAGE = 1;

interface UsePaginationParamsProps {
  defaultPage?: number;
  defaultPageSize?: number;
}

export function usePaginationParams({
  defaultPage = INITIAL_PAGE,
  defaultPageSize = INITIAL_PAGE_SIZE,
}: UsePaginationParamsProps = {}) {
  const { getNumericParam, updateParams } = useSearchParamsState();

  const page = getNumericParam(PAGE_PARAM, defaultPage);
  const pageSize = getNumericParam(PAGE_SIZE_PARAM, defaultPageSize);
  const hasPreviousPage = page > 1;

  const goToPage = (pageNumber: number) => {
    const validPage = Math.max(1, pageNumber);
    updateParams({
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
    updateParams({
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
