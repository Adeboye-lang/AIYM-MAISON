import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral" | "warning";
  icon?: LucideIcon;
  note?: string;
}

export default function MetricCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  note,
}: MetricCardProps) {
  const changeColors: Record<string, string> = {
    positive: "text-green-600",
    negative: "text-red-500",
    neutral: "text-brand-brown-light",
    warning: "text-amber-600",
  };

  return (
    <div className="bg-brand-white border-t-[3px] border-brand-yellow p-5 space-y-3">
      <div className="flex items-start justify-between">
        <p className="text-xs uppercase tracking-widest text-brand-brown-light">{label}</p>
        {Icon && (
          <div className="w-8 h-8 bg-brand-yellow-light flex items-center justify-center flex-shrink-0">
            <Icon className="h-4 w-4 text-brand-yellow" />
          </div>
        )}
      </div>
      <p className="font-display text-3xl text-brand-brown">{value}</p>
      {change && (
        <p className={cn("text-xs", changeColors[changeType])}>{change}</p>
      )}
      {note && <p className="text-xs text-amber-600">{note}</p>}
    </div>
  );
}
