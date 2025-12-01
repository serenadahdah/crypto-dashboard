import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props extends React.ComponentProps<typeof Button> {
  icon?: React.ReactNode;
  label: string;
  loadingLabel: string;
  isLoading: boolean;
}

export function AppLoadingButton({
  icon,
  label,
  loadingLabel,
  isLoading,
  ...props
}: Props) {
  return (
    <Button {...props}>
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </Button>
  );
}
