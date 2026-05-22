"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultIndex?: number;
}

export default function Tabs({ tabs, defaultIndex = 0 }: TabsProps) {
  const [active, setActive] = useState(defaultIndex);

  return (
    <div>
      <div className="flex border-b border-brand-yellow overflow-x-auto no-scrollbar">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "px-5 py-3 text-xs uppercase tracking-widest font-medium whitespace-nowrap transition-colors",
              active === i
                ? "text-brand-brown border-b-2 border-brand-yellow -mb-px"
                : "text-brand-brown-light hover:text-brand-brown"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6">{tabs[active]?.content}</div>
    </div>
  );
}
