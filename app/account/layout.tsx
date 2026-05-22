import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Navbar from "@/components/storefront/Navbar";
import AccountSidebar from "@/components/account/AccountSidebar";
import MobileAccountNav from "@/components/account/MobileAccountNav";
import { CartProvider } from "@/components/storefront/CartDrawer";
import { ReactNode } from "react";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <AnnouncementBar />
        <Navbar />
        <div className="flex flex-1 pt-26">
          <div className="hidden md:block">
            <AccountSidebar firstName="Imani" lastName="Thompson" />
          </div>
          {/* pb-16 on mobile to clear bottom nav */}
          <main className="flex-1 bg-brand-cream p-4 md:p-8 pb-20 md:pb-8">{children}</main>
        </div>
        <MobileAccountNav />
      </div>
    </CartProvider>
  );
}
