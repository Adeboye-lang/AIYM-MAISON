"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Check, X } from "lucide-react";

export default function AdminCustomers() {
  const [search, setSearch] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/customers?search=${encodeURIComponent(search)}`)
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers ?? []))
      .finally(() => setLoading(false));
  }, [search]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        <input
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-brand-brown-light bg-brand-white text-brand-brown px-4 py-2 text-sm outline-none focus:border-brand-yellow w-full sm:w-64"
        />
      </div>

      <div className="bg-brand-white border-t-[3px] border-brand-yellow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-yellow text-[10px] uppercase tracking-widest text-brand-brown-light">
              <th className="text-left p-3 md:p-4">Name</th>
              <th className="text-left p-3 md:p-4 hidden md:table-cell">Email</th>
              <th className="text-left p-3 md:p-4 hidden sm:table-cell">Join Date</th>
              <th className="text-left p-3 md:p-4">Orders</th>
              <th className="text-left p-3 md:p-4">Spent</th>
              <th className="text-left p-3 md:p-4 hidden sm:table-cell">Verified</th>
              <th className="text-left p-3 md:p-4 sr-only">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12 text-brand-brown-light text-sm animate-pulse">Loading…</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-brand-brown-light text-sm">No customers found.</td></tr>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) : customers.map((c: any) => (
              <tr key={c.id} className="border-b border-brand-surface hover:bg-brand-cream/50 transition-colors">
                <td className="p-3 md:p-4 font-medium text-brand-brown text-xs md:text-sm">{c.firstName} {c.lastName}</td>
                <td className="p-3 md:p-4 text-brand-brown-mid text-xs hidden md:table-cell">{c.email}</td>
                <td className="p-3 md:p-4 text-brand-brown-mid text-xs md:text-sm hidden sm:table-cell">{formatDate(c.createdat)}</td>
                <td className="p-3 md:p-4 text-brand-brown text-xs md:text-sm">{c.order_count}</td>
                <td className="p-3 md:p-4 text-brand-brown text-xs md:text-sm">{formatCurrency(parseFloat(c.total_spent))}</td>
                <td className="p-3 md:p-4 hidden sm:table-cell">
                  {c.emailVerified ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-brand-brown-light" />
                  )}
                </td>
                <td className="p-3 md:p-4">
                  <Link href={`/admin/customers/${c.id}`} className="text-xs text-brand-yellow hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
