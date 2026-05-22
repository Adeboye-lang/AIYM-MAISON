"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import { formatDate, formatCurrency } from "@/lib/utils";

const tabs = ["All", "Processing", "Dispatched", "Delivered", "Refunded"];

export default function OrdersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    fetch("/api/account/orders")
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    const matchesTab = activeTab === "All" || o.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="font-display text-4xl text-brand-brown uppercase">My Orders</h1>
      <div className="h-px bg-brand-yellow w-full" />

      <input
        placeholder="Search by order ID…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm bg-brand-white border border-brand-brown-light text-brand-brown px-4 py-2 text-sm outline-none focus:border-brand-yellow"
      />

      <div className="flex gap-0 border-b border-brand-yellow overflow-x-auto">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "text-brand-brown border-b-2 border-brand-yellow -mb-px font-medium"
                : "text-brand-brown-light hover:text-brand-brown"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-brand-brown-light text-sm py-8 text-center animate-pulse">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-brand-brown-light text-sm py-8 text-center">No orders found.</p>
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
              {filtered.map((order: any) => {
                const item = order.items?.[0];
                return (
                  <tr key={order.id} className="border-b border-brand-surface hover:bg-brand-surface/50 transition-colors">
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
  );
}
