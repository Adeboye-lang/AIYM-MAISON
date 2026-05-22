"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Users, Package, BarChart2, Star,
  RefreshCw, Mail, TrendingUp, Settings, ExternalLink, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Product", href: "/admin/product", icon: Package },
  { label: "Inventory", href: "/admin/inventory", icon: BarChart2 },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Returns", href: "/admin/returns", icon: RefreshCw },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Analytics", href: "/admin/analytics", icon: TrendingUp },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <aside className="w-60 bg-brand-brown flex flex-col flex-shrink-0 min-h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-brand-brown-mid">
        <p className="font-display text-2xl text-brand-yellow tracking-widest">AIYM</p>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-xs text-white/70">Admin</p>
          <span className="text-[9px] bg-brand-yellow/20 text-brand-yellow px-1.5 py-0.5 uppercase">
            Owner
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col p-3 gap-0.5 flex-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-sm transition-all",
                active
                  ? "bg-brand-brown-mid border-l-[3px] border-brand-yellow text-white"
                  : "text-white/70 hover:text-white hover:bg-brand-brown-mid/50 border-l-[3px] border-transparent"
              )}
            >
              <Icon className="h-4 w-4 text-brand-yellow flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-brand-brown-mid space-y-0.5">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ExternalLink className="h-4 w-4 text-brand-yellow" />
          View Store
        </a>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-red-400 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
