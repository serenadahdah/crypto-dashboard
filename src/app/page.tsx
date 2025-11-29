"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCoins } from "@/hooks/queries/use-coins";
import type { Coin } from "@/lib/coin-gecko";

export default function Home() {
  const { data: coins } = useCoins();

  if (!coins) return <div>Loading...</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Crypto Dashboard</h1>
      <div className="w-full max-w-4xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Coin</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>24h Change</TableHead>
              <TableHead>Market Cap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coins.map((coin: Coin, index: number) => (
              <TableRow key={coin.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
