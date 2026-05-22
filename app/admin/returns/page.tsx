"use client";

import { useState, useEffect, useCallback } from "react";
import StatusBadge from "@/components/admin/StatusBadge";
import Modal from "@/components/ui/Modal";
import { formatDate, formatCurrency } from "@/lib/utils";

const tabs = ["All", "Pending", "Item Received", "Refund Issued", "Rejected"];

export default function AdminReturns() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [returns, setReturns] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [manageTarget, setManageTarget] = useState<any | null>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ search });
    if (activeTab !== "All") params.set("status", activeTab);
    fetch(`/api/admin/returns?${params}`)
      .then((r) => r.json())
      .then((d) => { setReturns(d.returns ?? []); setStats(d.stats ?? {}); })
      .finally(() => setLoading(false));
  }, [search, activeTab]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const update = async (id: string, status: string, extra: Record<string, unknown> = {}) => {
    setSaving(true);
    await fetch(`/api/admin/returns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...extra }),
    });
    setSaving(false);
    setManageTarget(null);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-brand-white border-t-[3px] border-brand-yellow p-5">
          <p className="text-xs uppercase tracking-widest text-brand-brown-light mb-1">Pending Returns</p>
          <p className="font-display text-3xl text-brand-brown">{stats.pending ?? 0}</p>
        </div>
        <div className="bg-brand-white border-t-[3px] border-brand-yellow p-5">
          <p className="text-xs uppercase tracking-widest text-brand-brown-light mb-1">Refunds This Month</p>
          <p className="font-display text-3xl text-brand-brown">{formatCurrency(parseFloat(stats.refunds_this_month ?? "0"))}</p>
        </div>
        <div className="bg-brand-white border-t-[3px] border-brand-yellow p-5">
          <p className="text-xs uppercase tracking-widest text-brand-brown-light mb-1">Total Returns</p>
          <p className="font-display text-3xl text-brand-brown">{returns.length}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex border-b border-brand-yellow overflow-x-auto">
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
        <input
          placeholder="Search customer or order…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-brand-brown-light bg-brand-white text-brand-brown px-4 py-2 text-sm outline-none focus:border-brand-yellow w-56"
        />
      </div>

      <div className="bg-brand-white border-t-[3px] border-brand-yellow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-yellow text-[10px] uppercase tracking-widest text-brand-brown-light">
              <th className="text-left p-4">Return ID</th>
              <th className="text-left p-4">Order #</th>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Reason</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4 sr-only">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12 text-brand-brown-light text-sm animate-pulse">Loading…</td></tr>
            ) : returns.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-brand-brown-light text-sm">No returns found.</td></tr>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) : returns.map((r: any) => (
              <tr key={r.id} className="border-b border-brand-surface">
                <td className="p-4 font-medium text-brand-brown">{r.id.slice(0, 8).toUpperCase()}</td>
                <td className="p-4 text-brand-brown-mid">{r.orderId}</td>
                <td className="p-4 text-brand-brown-mid">{r.customer}</td>
                <td className="p-4 text-brand-brown-mid">{r.reason}</td>
                <td className="p-4 text-brand-brown-mid">{formatDate(r.createdat)}</td>
                <td className="p-4"><StatusBadge status={r.status} /></td>
                <td className="p-4">
                  <button
                    type="button"
                    onClick={() => { setManageTarget(r); setRefundAmount(r.refundamt?.toString() ?? ""); setAdminNote(r.adminnotes ?? ""); }}
                    className="text-xs text-brand-yellow hover:underline uppercase tracking-wide"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!manageTarget} onClose={() => setManageTarget(null)} title={`Return ${manageTarget?.id?.slice(0, 8).toUpperCase()}`} maxWidth="max-w-lg">
        {manageTarget && (
          <div className="space-y-4">
            <div className="text-sm space-y-1">
              <p><span className="text-brand-brown-light">Customer:</span> {manageTarget.customer}</p>
              <p><span className="text-brand-brown-light">Order:</span> {manageTarget.orderId}</p>
              <p><span className="text-brand-brown-light">Reason:</span> {manageTarget.reason}</p>
              {manageTarget.message && <p><span className="text-brand-brown-light">Message:</span> {manageTarget.message}</p>}
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={() => update(manageTarget.id, "item_received")}
              className="w-full border border-brand-brown-light text-brand-brown text-xs uppercase tracking-widest py-3 hover:bg-brand-surface transition-colors disabled:opacity-50"
            >
              Mark Item Received
            </button>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-brand-brown block">Refund Amount (£)</label>
              <input
                type="number"
                step="0.01"
                aria-label="Refund amount in GBP"
                placeholder="0.00"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="w-full border border-brand-brown-light bg-brand-white text-brand-brown px-4 py-2.5 text-sm outline-none focus:border-brand-yellow"
              />
              <button
                type="button"
                disabled={saving}
                onClick={() => update(manageTarget.id, "refund_issued", { refundAmt: parseFloat(refundAmount) || 0 })}
                className="w-full bg-brand-yellow text-brand-brown text-xs uppercase tracking-widest py-3 hover:bg-brand-yellow-light transition-colors disabled:opacity-50"
              >
                Confirm Refund of {formatCurrency(parseFloat(refundAmount) || 0)}
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-brand-brown block">Reject Reason</label>
              <textarea
                rows={2}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Reason for rejection…"
                className="w-full border border-brand-brown-light bg-brand-white text-brand-brown px-4 py-2.5 text-sm outline-none focus:border-brand-yellow resize-none"
              />
              <button
                type="button"
                disabled={saving}
                onClick={() => update(manageTarget.id, "rejected", { adminNotes: adminNote })}
                className="w-full border border-red-300 text-red-600 text-xs uppercase tracking-widest py-3 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Reject Return
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
