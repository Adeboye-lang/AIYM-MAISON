"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Menu, X, ExternalLink, LogOut,
  LayoutDashboard, ShoppingBag, Users, Package, BarChart2, Star,
  RefreshCw, Mail, TrendingUp, Settings } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Orders",    href: "/admin/orders",    icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Product",   href: "/admin/product",   icon: Package },
  { label: "Inventory", href: "/admin/inventory", icon: BarChart2 },
  { label: "Reviews",   href: "/admin/reviews",   icon: Star },
  { label: "Returns",   href: "/admin/returns",   icon: RefreshCw },
  { label: "Newsletter",href: "/admin/newsletter",icon: Mail },
  { label: "Analytics", href: "/admin/analytics", icon: TrendingUp },
  { label: "Settings",  href: "/admin/settings",  icon: Settings },
];

const titles: Record<string, string> = {
  "/admin/dashboard": "Dashboard", "/admin/orders": "Orders",
  "/admin/customers": "Customers", "/admin/product": "Product",
  "/admin/inventory": "Inventory", "/admin/reviews": "Reviews",
  "/admin/returns": "Returns",     "/admin/newsletter": "Newsletter",
  "/admin/analytics": "Analytics", "/admin/settings": "Settings",
};

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <>
      <div className="p-6 border-b border-brand-brown-mid flex items-center justify-between">
        <div>
          <p className="font-display text-2xl text-brand-yellow tracking-widest">AIYM</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-white/70">Admin</p>
            <span className="text-[9px] bg-brand-yellow/20 text-brand-yellow px-1.5 py-0.5 uppercase">Owner</span>
          </div>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="text-white/60 hover:text-white md:hidden" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex flex-col p-3 gap-0.5 flex-1 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href} onClick={onClose}
              className={cn("flex items-center gap-3 px-4 py-2.5 text-sm transition-all",
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

      <div className="p-3 border-t border-brand-brown-mid space-y-0.5">
        <a href="/" target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-white transition-colors">
          <ExternalLink className="h-4 w-4 text-brand-yellow" />
          View Store
        </a>
        <button type="button" onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-red-400 transition-colors w-full">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const base = Object.keys(titles).find((k) => pathname.startsWith(k)) ?? "/admin/dashboard";
  const title = titles[base] ?? "Admin";

  return (
    <div className="flex min-h-screen bg-brand-cream">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-brand-brown flex-col flex-shrink-0 min-h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-brand-brown flex flex-col">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex flex-col flex-1 min-w-0">
        {/* TopBar */}
        <header className="h-14 md:h-16 bg-brand-white border-b border-brand-yellow flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMobileOpen(true)}
              className="md:hidden text-brand-brown hover:text-brand-yellow transition-colors" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-display text-lg md:text-2xl text-brand-brown">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-brand-brown">Admin User</p>
              <p className="text-[10px] text-brand-brown-light">admin@maisonaiym.com</p>
            </div>
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-brand-yellow flex items-center justify-center text-brand-brown font-bold text-sm">
              {getInitials("Admin", "User")}
            </div>
            <ChevronDown className="h-4 w-4 text-brand-brown-light hidden sm:block" />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
