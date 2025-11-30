"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableSearch } from "@/components/ui/data-table-search";
import { DataTableSortHeader } from "@/components/ui/data-table-sort-header";
import { useCoins } from "@/hooks/queries/use-coins";
import { usePagination } from "@/hooks/use-pagination";
import { type Coin } from "@/lib/coin-gecko";
import { type SortField, type SortDirection, toApiSortOrder } from "@/types/sorting";

export default function AppCoinsTable() {
  const { page, pageSize, goToPage, changePageSize } = usePagination({ initialPageSize: 20 });
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("market_cap");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const order = toApiSortOrder({ field: sortField, direction: sortDirection });
  const { data: coins, isLoading, isError } = useCoins({ page, per_page: pageSize, order });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    goToPage(1);
  };

  const filteredCoins = useMemo(() => {
    if (!coins || !search.trim()) return coins || [];
    const query = search.toLowerCase();
    return coins.filter(
      (coin: Coin) =>
        coin.name?.toLowerCase().includes(query) ||
        coin.symbol?.toLowerCase().includes(query)
    );
  }, [coins, search]);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !coins) return <div>Error loading data.</div>;

  const hasPreviousPage = page > 1;
  const hasNextPage = coins.length === pageSize;

  return (
    <div className="w-full space-y-4">
      <DataTableSearch
        value={search}
        onChange={setSearch}
        placeholder="Search by name or symbol..."
        disabled={isLoading}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Coin</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>24h Change</TableHead>
            <TableHead>
              <DataTableSortHeader
                label="Market Cap"
                field="market_cap"
                currentField={sortField}
                currentDirection={sortDirection}
                onSort={handleSort}
              />
            </TableHead>
            <TableHead>
              <DataTableSortHeader
                label="24h Volume"
                field="volume"
                currentField={sortField}
                currentDirection={sortDirection}
                onSort={handleSort}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCoins.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No coins found matching "{search}"
              </TableCell>
            </TableRow>
          ) : (
            filteredCoins.map((coin: Coin, index: number) => (
              <TableRow key={coin.id}>
                <TableCell className="text-center">{(page - 1) * pageSize + index + 1}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <img src={coin.image} alt={coin.name} width={24} height={24} />
                  {coin.name} ({coin.symbol?.toUpperCase()})
                </TableCell>
                <TableCell>${coin.current_price?.toLocaleString()}</TableCell>
                <TableCell className={(coin.price_change_percentage_24h ?? 0) >= 0 ? "text-green-500" : "text-red-500"}>
                  {(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
                </TableCell>
                <TableCell>${(coin.market_cap ?? 0).toLocaleString()}</TableCell>
                <TableCell>${(coin.total_volume ?? 0).toLocaleString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <DataTablePagination
        currentPage={page}
        pageSize={pageSize}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
      />
    </div>
  );
}
