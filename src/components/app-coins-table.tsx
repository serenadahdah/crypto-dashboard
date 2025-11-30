"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useCoins } from "@/hooks/queries/use-coins";
import { usePagination } from "@/hooks/use-pagination";
import { type Coin } from "@/lib/coin-gecko";

export default function AppCoinsTable() {
  const { page, pageSize, goToPage, changePageSize } = usePagination({ initialPageSize: 20 });
  const { data: coins, isLoading, isError } = useCoins({ page, per_page: pageSize });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !coins) return <div>Error loading data.</div>;

  const hasPreviousPage = page > 1;
  const hasNextPage = coins.length === pageSize;

  return (
    <div className="w-full space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Coin</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>24h Change</TableHead>
            <TableHead>Market Cap</TableHead>
            <TableHead>24h Volume</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coins.map((coin: Coin, index: number) => (
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
          ))}
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
