"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, User, MapPin, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home",     href: "/account/dashboard",  icon: LayoutDashboard },
  { label: "Orders",   href: "/account/orders",      icon: Package },
  { label: "Profile",  href: "/account/profile",     icon: User },
  { label: "Address",  href: "/account/addresses",   icon: MapPin },
  { label: "Prefs",    href: "/account/preferences", icon: Settings },
];

export default function MobileAccountNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-brand-white border-t border-brand-yellow flex">
      {links.map(({ label, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href}
            className={cn("flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors",
              active ? "text-brand-yellow" : "text-brand-brown-light hover:text-brand-brown"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[9px] uppercase tracking-wide">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
