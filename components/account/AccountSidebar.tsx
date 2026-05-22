"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, User, MapPin, Settings, LogOut } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

const links = [
  { label: "Dashboard", href: "/account/dashboard", icon: LayoutDashboard },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "My Profile", href: "/account/profile", icon: User },
  { label: "My Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Preferences", href: "/account/preferences", icon: Settings },
];

// Props kept for backward compat but ignored — we fetch from API directly
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface AccountSidebarProps {
  firstName?: string;
  lastName?: string;
}

export default function AccountSidebar(_props: AccountSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [firstName, setFirstName] = useState("—");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    fetch("/api/account/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user) {
          setFirstName(d.user.firstName ?? "");
          setLastName(d.user.lastName ?? "");
        }
      })
      .catch(() => {});
  }, []);

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <aside className="w-64 bg-brand-surface flex flex-col flex-shrink-0 min-h-screen">
      {/* Avatar */}
      <div className="p-6 border-b border-brand-yellow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center text-brand-brown font-bold text-sm">
            {getInitials(firstName, lastName)}
          </div>
          <div>
            <p className="text-xs text-brand-brown-light uppercase tracking-wide">Welcome</p>
            <p className="text-sm font-medium text-brand-brown">{firstName}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col p-4 gap-1 flex-1">
        {links.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm transition-all",
                active
                  ? "border-l-[3px] border-brand-yellow text-brand-brown bg-brand-yellow/10"
                  : "text-brand-brown-mid hover:text-brand-brown border-l-[3px] border-transparent"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-brand-yellow">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 text-sm text-brand-brown-mid hover:text-red-500 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
