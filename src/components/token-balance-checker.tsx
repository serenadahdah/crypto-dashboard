"use client";

import { AppBanner } from "@/components/app/app-banner";
import { AppCard } from "@/components/app/app-card";
import { AppEmptyState } from "@/components/app/app-empty-state";
import { AppInput } from "@/components/app/app-input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins, Search, Wallet } from "lucide-react";
import { useState } from "react";
import { formatUnits, isAddress, type Address } from "viem";
import { useConnection, useReadContracts } from "wagmi";

const erc20Abi = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    name: "name",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
] as const;

interface TokenInfo {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  rawBalance: bigint;
}

export function TokenBalanceChecker() {
  const { address: walletAddress, isConnected } = useConnection();
  const [tokenAddress, setTokenAddress] = useState("");
  const [searchedToken, setSearchedToken] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    data: tokenData,
    isLoading,
    isError,
    error: contractError,
    refetch,
  } = useReadContracts({
    contracts:
      searchedToken && walletAddress
        ? [
            {
              address: searchedToken,
              abi: erc20Abi,
              functionName: "name",
            },
            {
              address: searchedToken,
              abi: erc20Abi,
              functionName: "symbol",
            },
            {
              address: searchedToken,
              abi: erc20Abi,
              functionName: "decimals",
            },
            {
              address: searchedToken,
              abi: erc20Abi,
              functionName: "balanceOf",
              args: [walletAddress],
            },
          ]
        : undefined,
    query: {
      enabled: !!searchedToken && !!walletAddress,
    },
  });

  const tokenInfo: TokenInfo | null = (() => {
    if (!tokenData || !searchedToken) return null;

    const [nameResult, symbolResult, decimalsResult, balanceResult] = tokenData;

    if (
      nameResult.status === "failure" ||
      symbolResult.status === "failure" ||
      decimalsResult.status === "failure" ||
      balanceResult.status === "failure"
    ) {
      return null;
    }

    const decimals = decimalsResult.result;
    const rawBalance = balanceResult.result;

    return {
      address: searchedToken,
      name: nameResult.result,
      symbol: symbolResult.result,
      decimals,
      balance: formatUnits(rawBalance, decimals),
      rawBalance,
    };
  })();

  const handleSearch = () => {
    setError(null);

    if (!tokenAddress.trim()) {
      setError("Please enter a token contract address");
      return;
    }

    if (!isAddress(tokenAddress)) {
      setError("Invalid Ethereum address format");
      return;
    }

    setSearchedToken(tokenAddress as Address);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatBalance = (balance: string) => {
    const num = Number.parseFloat(balance);
    if (num === 0) return "0";
    if (num < 0.0001) return "< 0.0001";
    if (num < 1) return num.toFixed(6);
    if (num < 1000) return num.toFixed(4);
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  if (!isConnected) {
    return (
      <AppEmptyState
        title="Wallet Not Connected"
        description="Connect your wallet to check token balances"
        icon={<Wallet />}
      />
    );
  }

  return (
    <AppCard
      title="Token Balance Checker"
      description="Enter an ERC-20 token contract address to check your balance"
      icon={<Coins className="h-5 w-5" />}
    >
      <div className="flex gap-2">
        <AppInput
          placeholder="0x... (Token Contract Address)"
          value={tokenAddress}
          error={error}
          onChange={(e) => {
            setTokenAddress(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>

      {isLoading && (
        <div className="mt-6 space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      )}

      {isError && !isLoading && searchedToken && (
        <AppBanner
          variant="error"
          title="Failed to fetch token data"
          description={
            contractError?.message?.includes("could not be found")
              ? "This address may not be a valid ERC-20 token contract"
              : "There was an error fetching the token data. Please check the address and try again."
          }
          className="mt-6"
        >
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </AppBanner>
      )}

      {tokenInfo && !isLoading && (
        <div className="mt-6 rounded-lg border bg-muted/50 p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{tokenInfo.name}</h3>
                <span className="text-sm text-muted-foreground">
                  ({tokenInfo.symbol})
                </span>
              </div>
              <div className="mt-2">
                <span className="text-3xl font-bold">
                  {formatBalance(tokenInfo.balance)}
                </span>
                <span className="ml-2 text-lg text-muted-foreground">
                  {tokenInfo.symbol}
                </span>
              </div>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <Coins className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground font-mono break-all">
              Contract: {tokenInfo.address}
            </p>
          </div>
        </div>
      )}

      {!searchedToken && !error && (
        <div className="mt-6 text-center py-8 text-muted-foreground">
          <p className="text-sm">Enter a token address above to get started</p>
          <p className="text-xs mt-2">
            Example: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 (USDC)
          </p>
        </div>
      )}
    </AppCard>
  );
}
