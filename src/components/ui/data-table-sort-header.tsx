"use client";

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { SortValue } from "@/types/sorting";
import { cn } from "@/lib/utils";
import { useTableSorting } from "@/hooks/use-table-sorting";

type SortableField = "market_cap" | "volume" | "price" | "change_24h";

interface DataTableSortHeaderProps {
  label: string;
  field: SortableField;
  className?: string;
}

export function DataTableSortHeader({
  label,
  field,
  className,
}: DataTableSortHeaderProps) {
  const { currentSort, setSort } = useTableSorting();
  const match = currentSort.match(/^(.+)_(asc|desc)$/);
  const currentField = match?.[1];
  const currentDirection = match?.[2] as "asc" | "desc" | undefined;

  const isActive = currentField === field;
  const Icon = isActive
    ? currentDirection === "asc"
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  const handleClick = () => {
    if (!isActive) {
      setSort(`${field}_desc` as SortValue);
    } else {
      const newDirection = currentDirection === "desc" ? "asc" : "desc";
      setSort(`${field}_${newDirection}` as const);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex items-center gap-1 hover:text-foreground transition-colors",
        isActive ? "text-foreground" : "text-muted-foreground",
        className,
      )}
    >
      {label}
      <Icon className="h-4 w-4" />
    </button>
  );
}
