import { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const config: Record<OrderStatus, { label: string; class: string }> = {
  Processing: { label: "Processing", class: "bg-amber-100 text-amber-700" },
  Dispatched: { label: "Dispatched", class: "bg-blue-100 text-blue-700" },
  Delivered: { label: "Delivered", class: "bg-green-100 text-green-700" },
  Refunded: { label: "Refunded", class: "bg-red-100 text-red-700" },
  Returned: { label: "Returned", class: "bg-orange-100 text-orange-700" },
  Cancelled: { label: "Cancelled", class: "bg-gray-100 text-gray-600" },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, class: cls } = config[status] ?? config.Processing;
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 text-xs font-medium uppercase tracking-wide", cls)}>
      {label}
    </span>
  );
}
