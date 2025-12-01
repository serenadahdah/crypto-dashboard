import { AppCard } from "@/components/app/app-card";
import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  description: string;
}

export function AppEmptyState({ icon, title, description }: Props) {
  return (
    <AppCard>
      <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
        <div className="rounded-full bg-muted p-4">
          <span className="h-8 w-8 text-muted-foreground">{icon}</span>
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </AppCard>
  );
}
