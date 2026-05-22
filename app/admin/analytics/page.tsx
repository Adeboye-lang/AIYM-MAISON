"use client";

import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from "recharts";
import ChartWrapper from "@/components/admin/ChartWrapper";
import { formatCurrency } from "@/lib/utils";

const periods = ["7D", "30D", "90D"] as const;

function PeriodToggle({ period, setPeriod }: { period: string; setPeriod: (p: (typeof periods)[number]) => void }) {
  return (
    <div className="flex gap-1">
      {periods.map((p) => (
        <button
          type="button"
          key={p}
          onClick={() => setPeriod(p)}
          className={`px-3 py-1 text-[10px] uppercase tracking-wide transition-colors ${
            period === p ? "text-brand-brown border-b border-brand-yellow" : "text-brand-brown-light hover:text-brand-brown"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  processing: "#D97706",
  dispatched: "#2563EB",
  delivered: "#16A34A",
  refunded: "#DC2626",
  returned: "#9333EA",
  cancelled: "#6B7280",
};

export default function AdminAnalytics() {
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
  const statusBreakdown = data?.statusBreakdown ?? [];
  const recentOrders = data?.recentOrders ?? [];

  const revenue = parseFloat(m.revenue ?? "0");
  const ordersCount = parseInt(m.orders_today ?? "0");
  const customers = parseInt(m.customers ?? "0");
  const avgOrder = recentOrders.length > 0
    ? recentOrders.reduce((s: number, o: { total: number }) => s + Number(o.total), 0) / recentOrders.length
    : 0;

  const pieData = statusBreakdown.map((s: { status: string; count: string }) => ({
    name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
    value: parseInt(s.count),
    color: STATUS_COLORS[s.status] ?? "#A07850",
  }));

  const variantData = [
    { name: "Foam Only", orders: recentOrders.filter((o: { variant: string }) => o.variant?.toLowerCase().includes("foam only") || o.variant?.toLowerCase().includes("tanning foam") && !o.variant?.toLowerCase().includes("mitt")).length },
    { name: "Foam + Mitts", orders: recentOrders.filter((o: { variant: string }) => o.variant?.toLowerCase().includes("mitt")).length },
  ];

  const topCustomers = recentOrders.slice(0, 5).map((o: { customer: string; email: string; total: number }) => ({
    name: o.customer,
    email: o.email,
    orders: 1,
    spent: Number(o.total),
  }));

  const isEmpty = recentOrders.length === 0 && statusBreakdown.length === 0;

  return (
    <div className="space-y-6">
      {isEmpty && (
        <div className="bg-amber-50 border border-brand-yellow px-5 py-4">
          <p className="text-sm text-amber-700">No orders yet — analytics will populate as customers start purchasing.</p>
        </div>
      )}

      {/* Revenue summary */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(revenue) },
          { label: "Total Customers", value: String(customers) },
          { label: "Avg Order Value", value: avgOrder > 0 ? formatCurrency(avgOrder) : "—" },
          { label: "Orders Today", value: String(ordersCount) },
        ].map((s) => (
          <div key={s.label} className="bg-brand-white border-t-[3px] border-brand-yellow p-5">
            <p className="text-xs uppercase tracking-widest text-brand-brown-light mb-1">{s.label}</p>
            <p className="font-display text-2xl text-brand-brown">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <ChartWrapper title="Revenue Over Time" action={<PeriodToggle period={period} setPeriod={setPeriod} />}>
        {revenueChart.length === 0 ? (
          <div className="flex items-center justify-center h-[220px] text-brand-brown-light text-sm">
            No revenue data yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueChart}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#A07850" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#A07850" }} axisLine={false} tickLine={false} tickFormatter={(v) => `£${v}`} />
              <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #C9A84C", borderRadius: 0 }} formatter={(v) => [formatCurrency(Number(v)), "Revenue"]} />
              <Line type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartWrapper>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Orders by status */}
        <ChartWrapper title="Orders by Status">
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-brand-brown-light text-sm">No orders yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={35}>
                  {pieData.map((entry: { color: string }, i: number) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend iconType="square" iconSize={10} formatter={(v) => <span className="text-xs text-brand-brown-mid">{v}</span>} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartWrapper>

        {/* Orders by variant */}
        <ChartWrapper title="Orders by Variant">
          {variantData.every((d) => d.orders === 0) ? (
            <div className="flex items-center justify-center h-[200px] text-brand-brown-light text-sm">No orders yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={variantData}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#A07850" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#A07850" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #C9A84C", borderRadius: 0 }} />
                <Bar dataKey="orders" fill="#C9A84C" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartWrapper>
      </div>

      {/* Recent orders as top customers */}
      <div className="bg-brand-white border-t-[3px] border-brand-yellow overflow-x-auto">
        <div className="p-5 border-b border-brand-surface">
          <h3 className="text-xs uppercase tracking-widest text-brand-brown">Recent Customers</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-yellow text-[10px] uppercase tracking-widest text-brand-brown-light">
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Order Total</th>
            </tr>
          </thead>
          <tbody>
            {topCustomers.length === 0 ? (
              <tr><td colSpan={3} className="p-4 text-center text-brand-brown-light text-sm">No customers yet.</td></tr>
            ) : topCustomers.map((c: { name: string; email: string; spent: number }, i: number) => (
              <tr key={i} className="border-b border-brand-surface">
                <td className="p-4 font-medium text-brand-brown">{c.name}</td>
                <td className="p-4 text-brand-brown-mid text-xs">{c.email}</td>
                <td className="p-4 text-brand-brown">{formatCurrency(c.spent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
