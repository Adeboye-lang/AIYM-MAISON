import { cn } from "@/lib/utils";
import { OrderStatus } from "@/lib/types";

const steps: OrderStatus[] = ["Processing", "Dispatched", "Delivered"];

function stepIndex(status: OrderStatus) {
  return steps.indexOf(status);
}

export default function OrderTimeline({ status }: { status: OrderStatus }) {
  const current = stepIndex(status);

  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const upcoming = i > current;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center border-2 text-xs font-bold",
                  done && "bg-brand-yellow border-brand-yellow text-brand-brown",
                  active && "border-brand-yellow bg-brand-yellow/20 text-brand-yellow animate-pulse",
                  upcoming && "border-brand-brown-light text-brand-brown-light"
                )}
              >
                {done ? "✓" : i + 1}
              </div>
              <p className={cn(
                "text-[10px] uppercase tracking-wide whitespace-nowrap",
                done || active ? "text-brand-brown" : "text-brand-brown-light"
              )}>
                {step === "Processing" ? "Order Placed" : step}
              </p>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-2",
                  done ? "bg-brand-yellow" : "bg-brand-brown-light/30"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
