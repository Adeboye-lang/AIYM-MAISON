import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
}

export default function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon className="h-10 w-10 text-brand-brown-light/40 mb-4" />}
      <p className="text-brand-brown-mid font-medium mb-1">{title}</p>
      {description && <p className="text-xs text-brand-brown-light">{description}</p>}
    </div>
  );
}
