"use client";

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { type SortField, type SortDirection } from "@/types/sorting";
import { cn } from "@/lib/utils";

interface DataTableSortHeaderProps {
  label: string;
  field: SortField;
  currentField: SortField | null;
  currentDirection: SortDirection;
  onSort: (field: SortField) => void;
  className?: string;
}

export function DataTableSortHeader({
  label,
  field,
  currentField,
  currentDirection,
  onSort,
  className,
}: DataTableSortHeaderProps) {
  const isActive = currentField === field;

  const Icon = isActive
    ? currentDirection === "asc"
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className={cn(
        "flex items-center gap-1 hover:text-foreground transition-colors",
        isActive ? "text-foreground" : "text-muted-foreground",
        className
      )}
    >
      {label}
      <Icon className="h-4 w-4" />
    </button>
  );
}

