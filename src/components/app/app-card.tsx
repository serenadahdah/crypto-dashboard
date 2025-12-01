interface Props {
  children: React.ReactNode;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function AppCard({ title, description, children, icon }: Props) {
  return (
    <div className="rounded-lg border bg-card p-6">
      {title && (
        <h2 className="text-lg font-semibold flex items-center gap-2">
          {icon}
          {title}
        </h2>
      )}
      {description && (
        <p className="text-sm text-muted-foreground mt-1 mb-6">{description}</p>
      )}
      {children}
    </div>
  );
}
