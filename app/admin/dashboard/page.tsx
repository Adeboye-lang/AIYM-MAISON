"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import MetricCard from "@/components/admin/MetricCard";
import ChartWrapper from "@/components/admin/ChartWrapper";
import StatusBadge from "@/components/admin/StatusBadge";
import { DollarSign, ShoppingBag, Clock, Users } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  processing: "#D97706",
  dispatched: "#2563EB",
  delivered: "#16A34A",
  refunded: "#DC2626",
  returned: "#9333EA",
  cancelled: "#6B7280",
};

const periods = ["7D", "30D", "90D", "ALL"] as const;

function getInitials(name: string) {
  const parts = name.split(" ");
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("7D");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-brand-brown-light text-sm uppercase tracking-widest animate-pulse">Loading…</p>
      </div>
    );
  }

  const m = data?.metrics ?? {};
  const revenueChart = data?.revenueChart ?? [];
  const statusBreakdown: { status: string; count: string }[] = data?.statusBreakdown ?? [];
  const recentOrders = data?.recentOrders ?? [];
  const recentSignups = data?.recentSignups ?? [];
  const locations: { country: string; order_count: string; revenue: string }[] = data?.locations ?? [];
  const lowStock = parseInt(m.low_stock_products ?? "0") > 0;

  const pieData = statusBreakdown.map((s) => ({
    name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
    value: parseInt(s.count),
    color: STATUS_COLORS[s.status] ?? "#A07850",
  }));

  return (
    <div className="space-y-6">
      {lowStock && (
        <div className="bg-amber-50 border border-brand-yellow px-5 py-4 flex items-center justify-between">
          <p className="text-sm text-amber-700">⚠ Low Stock Alert — check inventory</p>
          <Link href="/admin/inventory" className="text-xs text-brand-yellow hover:underline uppercase tracking-wide">
            Update Stock
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard label="Total Revenue" value={formatCurrency(parseFloat(m.revenue ?? "0"))} icon={DollarSign} />
        <MetricCard label="Orders Today" value={m.orders_today ?? "0"} icon={ShoppingBag} />
        <MetricCard label="Pending Orders" value={m.pending ?? "0"} note="Needs your attention" icon={Clock} />
        <MetricCard label="Total Customers" value={m.customers ?? "0"} icon={Users} />
      </div>

      <ChartWrapper
        title="Revenue (Last 7 Days)"
        action={
          <div className="flex gap-1">
            {periods.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-[10px] uppercase tracking-wide transition-colors ${
                  period === p
                    ? "text-brand-brown border-b border-brand-yellow"
                    : "text-brand-brown-light hover:text-brand-brown"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        }
      >
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={revenueChart}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#A07850" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#A07850" }} axisLine={false} tickLine={false} tickFormatter={(v) => `£${v}`} />
            <Tooltip
              contentStyle={{ background: "#FFFFFF", border: "1px solid #C9A84C", borderRadius: 0 }}
              formatter={(v) => [formatCurrency(Number(v)), "Revenue"]}
            />
            <Line type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartWrapper title="Orders by Status">
          {pieData.length === 0 ? (
            <p className="text-center text-brand-brown-light text-sm py-12">No orders yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={75} innerRadius={40}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend iconType="square" iconSize={10} formatter={(v) => <span className="text-xs text-brand-brown-mid">{v}</span>} />
                <Tooltip formatter={(v) => [Number(v), "Orders"]} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartWrapper>

        <ChartWrapper title="Recent Signups">
          {recentSignups.length === 0 ? (
            <p className="text-center text-brand-brown-light text-sm py-12">No signups yet.</p>
          ) : (
            <div className="space-y-3">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {recentSignups.map((u: any) => (
                <div key={u.email} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-yellow flex items-center justify-center text-brand-brown text-xs font-bold flex-shrink-0">
                    {getInitials(u.name ?? u.email)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-brand-brown truncate">{u.name}</p>
                    <p className="text-xs text-brand-brown-light truncate">{u.email}</p>
                  </div>
                  <p className="text-xs text-brand-brown-light">{formatDate(u.createdat)}</p>
                </div>
              ))}
            </div>
          )}
        </ChartWrapper>
      </div>

      {/* Locations */}
      <ChartWrapper title="Orders by Location">
        {locations.length === 0 ? (
          <p className="text-center text-brand-brown-light text-sm py-8">No location data yet.</p>
        ) : (
          <div className="space-y-3">
            {(() => {
              const maxCount = Math.max(...locations.map((l) => parseInt(l.order_count)));
              const COUNTRY_FLAG: Record<string, string> = {
                GB: "🇬🇧", IE: "🇮🇪", US: "🇺🇸", CA: "🇨🇦",
                AU: "🇦🇺", NG: "🇳🇬", GH: "🇬🇭", FR: "🇫🇷",
                DE: "🇩🇪", Unknown: "🌍",
              };
              return locations.map((loc) => {
                const count = parseInt(loc.order_count);
                const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                return (
                  <div key={loc.country} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-brand-brown flex items-center gap-2">
                        <span>{COUNTRY_FLAG[loc.country] ?? "🌍"}</span>
                        <span>{loc.country === "GB" ? "United Kingdom" : loc.country}</span>
                      </span>
                      <span className="text-brand-brown-light">{count} orders · {formatCurrency(parseFloat(loc.revenue))}</span>
                    </div>
                    <div className="w-full bg-brand-surface h-1.5 rounded-full">
                      <div
                        className="bg-brand-yellow h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </ChartWrapper>

      <div className="bg-brand-white border-t-[3px] border-brand-yellow p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs uppercase tracking-widest text-brand-brown font-medium">Recent Orders</h3>
          <Link href="/admin/orders" className="text-xs text-brand-yellow hover:underline">View all</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-center text-brand-brown-light text-sm py-8">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-yellow text-[10px] uppercase tracking-widest text-brand-brown-light">
                  <th className="text-left py-2 pr-4">Order #</th>
                  <th className="text-left py-2 pr-4">Customer</th>
                  <th className="text-left py-2 pr-4">Date</th>
                  <th className="text-left py-2 pr-4">Item</th>
                  <th className="text-left py-2 pr-4">Total</th>
                  <th className="text-left py-2 pr-4">Status</th>
                  <th className="text-left py-2" aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {recentOrders.map((o: any) => (
                  <tr key={o.id} className="border-b border-brand-surface hover:bg-brand-cream/50 transition-colors">
                    <td className="py-3 pr-4 font-medium text-brand-brown">#{o.id.slice(0, 8).toUpperCase()}</td>
                    <td className="py-3 pr-4 text-brand-brown-mid">{o.customer}</td>
                    <td className="py-3 pr-4 text-brand-brown-mid">{formatDate(o.createdat)}</td>
                    <td className="py-3 pr-4 text-brand-brown-mid">{o.variant ?? "—"}</td>
                    <td className="py-3 pr-4 text-brand-brown">{formatCurrency(o.total)}</td>
                    <td className="py-3 pr-4"><StatusBadge status={o.status} /></td>
                    <td className="py-3">
                      <Link href={`/admin/orders/${o.id}`} className="text-xs text-brand-yellow hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
