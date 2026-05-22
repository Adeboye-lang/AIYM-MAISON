"use client";

import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { getInitials } from "@/lib/utils";

const titles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/orders": "Orders",
  "/admin/customers": "Customers",
  "/admin/product": "Product",
  "/admin/inventory": "Inventory",
  "/admin/reviews": "Reviews",
  "/admin/returns": "Returns",
  "/admin/newsletter": "Newsletter",
  "/admin/analytics": "Analytics",
  "/admin/settings": "Settings",
};

export default function TopBar() {
  const pathname = usePathname();
  const base = Object.keys(titles).find((k) => pathname.startsWith(k)) ?? "/admin/dashboard";
  const title = titles[base] ?? "Admin";

  return (
    <header className="h-16 bg-brand-white border-b border-brand-yellow flex items-center justify-between px-6 sticky top-0 z-20">
      <h1 className="font-display text-2xl text-brand-brown">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-medium text-brand-brown">Admin User</p>
          <p className="text-[10px] text-brand-brown-light">admin@maisonaiym.com</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-brand-yellow flex items-center justify-center text-brand-brown font-bold text-sm">
          {getInitials("Admin", "User")}
        </div>
        <ChevronDown className="h-4 w-4 text-brand-brown-light" />
      </div>
    </header>
  );
}
