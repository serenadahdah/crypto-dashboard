import { cn } from "@/lib/utils";

interface ChangeBadgeProps {
  value: number;
  className?: string;
}

export function ChangeBadge({ value, className }: ChangeBadgeProps) {
  const isPositive = value >= 0;

  return (
    <span
      className={cn(
        "inline-flex px-2 py-0.5 rounded-full text-sm font-medium",
        isPositive
          ? "bg-success/10 text-success"
          : "bg-destructive/10 text-destructive",
        className,
      )}
    >
      {isPositive ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}
