import { cva, type VariantProps } from "class-variance-authority";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const bannerVariants = cva("mb-4 rounded-lg border p-4 relative", {
  variants: {
    variant: {
      warning: "border-yellow-500/50 bg-yellow-500/10",
      error: "border-destructive/50 bg-destructive/10",
      success: "border-green-500/50 bg-green-500/10",
      info: "border-blue-500/50 bg-blue-500/10",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

const titleVariants = cva("font-medium", {
  variants: {
    variant: {
      warning: "text-yellow-500",
      error: "text-destructive",
      success: "text-green-500",
      info: "text-blue-500",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

const iconMap: Record<
  NonNullable<VariantProps<typeof bannerVariants>["variant"]>,
  LucideIcon
> = {
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
};

interface AppBannerProps extends VariantProps<typeof bannerVariants> {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  onDismiss?: () => void;
}

export function AppBanner({
  variant = "info",
  title,
  description,
  children,
  className,
  onDismiss,
}: AppBannerProps) {
  const Icon = iconMap[variant ?? "info"];

  return (
    <div className={cn(bannerVariants({ variant }), className)}>
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 mt-0.5", titleVariants({ variant }))} />
        <div className="flex-1">
          <h4 className={titleVariants({ variant })}>{title}</h4>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          {children}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
