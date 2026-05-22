"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import { formatDate, formatCurrency } from "@/lib/utils";

const quickLinks = [
  { label: "Edit Profile", href: "/account/profile" },
  { label: "Manage Addresses", href: "/account/addresses" },
  { label: "View All Orders", href: "/account/orders" },
  { label: "Contact Us", href: "mailto:support@maisonaiym.com" },
];

export default function AccountDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/account/me").then((r) => r.json()),
      fetch("/api/account/orders").then((r) => r.json()),
    ]).then(([u, o]) => {
      setUser(u.user ?? null);
      setOrders(o.orders ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const recentOrders = orders.slice(0, 3);
  const activeReturns = 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-brand-brown-light text-sm uppercase tracking-widest animate-pulse">Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="font-display text-4xl md:text-5xl text-brand-brown mb-2">
          Welcome back{user ? `, ${user.firstName}` : ""}.
        </h1>
        <p className="text-brand-brown-light text-sm">
          Here&apos;s everything happening with your AIYM account.
        </p>
        <div className="h-px bg-brand-yellow w-full mt-6" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "Total Orders", value: orders.length },
          { label: "Loyalty Points", value: "Coming soon" },
          { label: "Active Returns", value: activeReturns },
        ].map((card) => (
          <div key={card.label} className="bg-brand-white border-t-[3px] border-brand-yellow p-6">
            <p className="text-xs uppercase tracking-widest text-brand-brown-light mb-2">{card.label}</p>
            <p className="font-display text-3xl text-brand-brown">{card.value}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs uppercase tracking-widest text-brand-brown font-medium">Recent Orders</p>
          <Link href="/account/orders" className="text-xs text-brand-yellow hover:underline">View all orders</Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="bg-brand-white p-12 text-center">
            <p className="text-brand-brown-light text-sm mb-4">You haven&apos;t placed any orders yet.</p>
            <Link href="/" className="inline-flex items-center uppercase tracking-widest text-xs px-8 py-3 bg-brand-yellow text-brand-brown hover:bg-brand-yellow-light transition-colors">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-yellow text-[10px] uppercase tracking-widest text-brand-brown-light">
                  <th className="text-left py-3 pr-4">Order #</th>
                  <th className="text-left py-3 pr-4">Date</th>
                  <th className="text-left py-3 pr-4">Item</th>
                  <th className="text-left py-3 pr-4">Total</th>
                  <th className="text-left py-3 pr-4">Status</th>
                  <th className="text-left py-3 sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {recentOrders.map((order: any) => {
                  const item = order.items?.[0];
                  return (
                    <tr key={order.id} className="border-b border-brand-surface">
                      <td className="py-4 pr-4 font-medium text-brand-brown">#{order.id.slice(0, 8).toUpperCase()}</td>
                      <td className="py-4 pr-4 text-brand-brown-mid">{formatDate(order.createdat)}</td>
                      <td className="py-4 pr-4 text-brand-brown-mid">{item?.name ?? "—"}</td>
                      <td className="py-4 pr-4 text-brand-brown">{formatCurrency(order.total)}</td>
                      <td className="py-4 pr-4"><OrderStatusBadge status={order.status} /></td>
                      <td className="py-4">
                        <Link href={`/account/orders/${order.id}`} className="text-xs text-brand-yellow hover:underline uppercase tracking-wide">View</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="group bg-brand-white p-6 border-t-[3px] border-transparent hover:border-brand-yellow transition-all duration-200"
          >
            <p className="font-display text-lg text-brand-brown group-hover:text-brand-yellow transition-colors">
              {link.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
