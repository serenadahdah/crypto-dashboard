"use client";

import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableSearch } from "@/components/ui/data-table-search";
import { DataTableSortHeader } from "@/components/ui/data-table-sort-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useCoins } from "@/hooks/queries/use-coins";
import type { Coin } from "@/lib/coin-gecko";
import { useMemo, useState } from "react";
import { useTableSorting } from "@/hooks/use-table-sorting";
import { usePaginationParams } from "@/hooks/use-pagination-params";

export default function AppCoinsTable() {
  const { page, pageSize } = usePaginationParams();
  const [search, setSearch] = useState("");
  const { currentSort, resetSort } = useTableSorting();
  const { data: coins, isLoading, isError } = useCoins();

  const hasActiveFilters =
    search.trim() !== "" || currentSort !== "market_cap_desc" || page > 1;

  const handleReset = () => {
    setSearch("");
    resetSort();
  };

  // TODO: refactor search to API filtering
  const filteredCoins = useMemo(() => {
    if (!coins || !search.trim()) return coins ?? [];

    const query = search.toLowerCase();
    return coins.filter(
      (coin: Coin) =>
        coin.name?.toLowerCase().includes(query) ||
        coin.symbol?.toLowerCase().includes(query)
    );
  }, [coins, search]);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !coins) return <div>Error loading data.</div>;

  const hasNextPage = coins.length === pageSize;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <DataTableSearch
          value={search}
          onChange={setSearch}
          placeholder="Search by name or symbol..."
          disabled={isLoading}
        />
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-9 px-3"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Coin</TableHead>
            <TableHead>
              <DataTableSortHeader label="Price" field="price" />
            </TableHead>
            <TableHead>
              <DataTableSortHeader label="24h Change" field="change_24h" />
            </TableHead>
            <TableHead>
              <DataTableSortHeader label="Market Cap" field="market_cap" />
            </TableHead>
            <TableHead>
              <DataTableSortHeader label="24h Volume" field="volume" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCoins.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-8"
              >
                No coins found matching "{search}"
              </TableCell>
            </TableRow>
          ) : (
            filteredCoins.map((coin: Coin, index: number) => (
              <TableRow key={coin.id}>
                <TableCell className="text-center">
                  {(page - 1) * pageSize + index + 1}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    width={24}
                    height={24}
                  />
                  {coin.name} ({coin.symbol?.toUpperCase()})
                </TableCell>
                <TableCell>${coin.current_price?.toLocaleString()}</TableCell>
                <TableCell
                  className={
                    (coin.price_change_percentage_24h ?? 0) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
                </TableCell>
                <TableCell>
                  ${(coin.market_cap ?? 0).toLocaleString()}
                </TableCell>
                <TableCell>
                  ${(coin.total_volume ?? 0).toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <DataTablePagination hasNextPage={hasNextPage} isLoading={isLoading} />
    </div>
  );
}
