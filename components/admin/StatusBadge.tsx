import { cn } from "@/lib/utils";
import { OrderStatus, PaymentStatus } from "@/lib/types";

type AnyStatus = OrderStatus | PaymentStatus | string;

const config: Record<string, string> = {
  "pre-order": "bg-purple-100 text-purple-700",
  Processing: "bg-amber-100 text-amber-700",
  Dispatched: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Refunded: "bg-gray-100 text-gray-600",
  Returned: "bg-orange-100 text-orange-700",
  Cancelled: "bg-red-100 text-red-600",
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Failed: "bg-red-100 text-red-600",
  approved: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-600",
  flagged: "bg-orange-100 text-orange-700",
  active: "bg-green-100 text-green-700",
  unsubscribed: "bg-gray-100 text-gray-600",
};

export default function StatusBadge({ status }: { status: AnyStatus }) {
  const cls = config[status] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 text-xs font-medium uppercase tracking-wide", cls)}>
      {status}
    </span>
  );
}
