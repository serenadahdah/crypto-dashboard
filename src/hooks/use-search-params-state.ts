"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type ParamValue = string | number | null;

export function useSearchParamsState() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getParam = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams],
  );

  const getNumericParam = useCallback(
    (key: string, defaultValue: number): number => {
      const value = searchParams.get(key);
      return value ? Number(value) || defaultValue : defaultValue;
    },
    [searchParams],
  );

  const createQueryString = useCallback(
    (params: Record<string, ParamValue>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams],
  );

  const updateParams = useCallback(
    (params: Record<string, ParamValue>, options?: { scroll?: boolean }) => {
      const queryString = createQueryString(params);
      router.push(`?${queryString}`, { scroll: options?.scroll ?? false });
    },
    [router, createQueryString],
  );

  const clearParams = useCallback(
    (keys: string[]) => {
      const params: Record<string, null> = {};
      for (const key of keys) {
        params[key] = null;
      }
      updateParams(params);
    },
    [updateParams],
  );

  return {
    searchParams,
    getParam,
    getNumericParam,
    createQueryString,
    updateParams,
    clearParams,
  };
}
