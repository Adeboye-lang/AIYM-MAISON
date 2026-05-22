"use client";

import { ReactNode } from "react";

interface ChartWrapperProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export default function ChartWrapper({ title, children, action }: ChartWrapperProps) {
  return (
    <div className="bg-brand-white border-t-[3px] border-brand-yellow p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs uppercase tracking-widest text-brand-brown font-medium">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
