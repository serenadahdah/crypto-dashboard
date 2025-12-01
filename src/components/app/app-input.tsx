import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface Props extends React.ComponentProps<typeof Input> {
  error?: string | null;
  label?: string;
}

export function AppInput({ className, error, label, ...props }: Props) {
  return (
    <div className="flex flex-col w-full gap-1.5">
      {label && (
        <label htmlFor={props.id} className="text-sm font-medium block">
          {label}
        </label>
      )}
      <Input
        {...props}
        className={cn(error && "border-destructive", className)}
      />
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
