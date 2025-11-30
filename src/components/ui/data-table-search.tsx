"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DataTableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DataTableSearch({ value, onChange, placeholder = "Search...", disabled = false }: DataTableSearchProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="pl-9"
      />
    </div>
  );
}

