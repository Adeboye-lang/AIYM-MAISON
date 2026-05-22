"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Download } from "lucide-react";

const statusOptions = ["All", "Processing", "Dispatched", "Delivered", "Returned", "Refunded", "Cancelled"];

export default function AdminOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ search, page: String(page) });
    if (statusFilter !== "All") params.set("status", statusFilter);
    fetch(`/api/admin/orders?${params}`)
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders ?? []); setTotal(d.total ?? 0); })
      .finally(() => setLoading(false));
  }, [search, statusFilter, page]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center">
        <input
          placeholder="Search by order ID or customer…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border border-brand-brown-light bg-brand-white text-brand-brown px-4 py-2 text-sm outline-none focus:border-brand-yellow w-full sm:w-64"
        />
        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-brand-brown-light bg-brand-white text-brand-brown px-4 py-2 text-sm outline-none focus:border-brand-yellow"
        >
          {statusOptions.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button type="button" className="flex items-center gap-2 border border-brand-brown-light text-brand-brown px-4 py-2 text-xs uppercase tracking-wide hover:bg-brand-surface transition-colors">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      <div className="bg-brand-white border-t-[3px] border-brand-yellow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-yellow text-[10px] uppercase tracking-widest text-brand-brown-light">
              <th className="text-left p-3 md:p-4">Order #</th>
              <th className="text-left p-3 md:p-4">Customer</th>
              <th className="text-left p-3 md:p-4 hidden md:table-cell">Email</th>
              <th className="text-left p-3 md:p-4 hidden sm:table-cell">Date</th>
              <th className="text-left p-3 md:p-4 hidden lg:table-cell">Item</th>
              <th className="text-left p-3 md:p-4">Total</th>
              <th className="text-left p-3 md:p-4">Status</th>
              <th className="text-left p-3 md:p-4 sr-only">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-12 text-brand-brown-light text-sm animate-pulse">Loading…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-brand-brown-light text-sm">No orders found.</td></tr>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) : orders.map((o: any) => (
              <tr key={o.id} className="border-b border-brand-surface hover:bg-brand-cream/50 transition-colors">
                <td className="p-3 md:p-4 font-medium text-brand-brown text-xs md:text-sm">#{o.id.slice(0, 8).toUpperCase()}</td>
                <td className="p-3 md:p-4 text-brand-brown-mid text-xs md:text-sm">{o.customer}</td>
                <td className="p-3 md:p-4 text-brand-brown-mid text-xs hidden md:table-cell">{o.email}</td>
                <td className="p-3 md:p-4 text-brand-brown-mid text-xs md:text-sm hidden sm:table-cell">{formatDate(o.createdat)}</td>
                <td className="p-3 md:p-4 text-brand-brown-mid text-xs hidden lg:table-cell">{o.variant ?? "—"}</td>
                <td className="p-3 md:p-4 text-brand-brown text-xs md:text-sm">{formatCurrency(o.total)}</td>
                <td className="p-3 md:p-4"><StatusBadge status={o.status} /></td>
                <td className="p-3 md:p-4">
                  <Link href={`/admin/orders/${o.id}`} className="text-xs text-brand-yellow hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-brand-brown-light">
        <span>Showing {orders.length} of {total} orders</span>
        <div className="flex gap-2">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 border border-brand-brown-light hover:bg-brand-surface disabled:opacity-40">←</button>
          <span className="px-3 py-1.5 border border-brand-yellow bg-brand-yellow text-brand-brown">{page}</span>
          <button type="button" disabled={orders.length < 20} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 border border-brand-brown-light hover:bg-brand-surface disabled:opacity-40">→</button>
        </div>
      </div>
    </div>
  );
}
