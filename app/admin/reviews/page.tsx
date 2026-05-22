"use client";

import { useState, useEffect, useCallback } from "react";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { Star } from "lucide-react";
import { formatDate } from "@/lib/utils";

const tabs = ["All", "Pending", "Approved", "Rejected", "Flagged"];

export default function AdminReviews() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reviews, setReviews] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ search });
    if (activeTab !== "All") params.set("status", activeTab);
    fetch(`/api/admin/reviews?${params}`)
      .then((r) => r.json())
      .then((d) => { setReviews(d.reviews ?? []); setStats(d.stats ?? {}); })
      .finally(() => setLoading(false));
  }, [search, activeTab]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const deleteReview = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/admin/reviews/${deleteTarget}`, { method: "DELETE" });
    setDeleteTarget(null);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: "Average Rating", value: stats.avg_rating ? `${stats.avg_rating} ★` : "—" },
          { label: "Total", value: stats.total ?? 0 },
          { label: "Pending", value: stats.pending ?? 0 },
          { label: "Approved", value: stats.approved ?? 0 },
        ].map((s) => (
          <div key={s.label} className="bg-brand-white border-t-[3px] border-brand-yellow p-4">
            <p className="text-xs uppercase tracking-widest text-brand-brown-light mb-1">{s.label}</p>
            <p className="font-display text-2xl text-brand-brown">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex border-b border-brand-yellow">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs uppercase tracking-widest transition-colors ${
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
          placeholder="Search reviews…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-brand-brown-light bg-brand-white text-brand-brown px-4 py-2 text-sm outline-none focus:border-brand-yellow w-56"
        />
      </div>

      <div className="bg-brand-white border-t-[3px] border-brand-yellow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-yellow text-[10px] uppercase tracking-widest text-brand-brown-light">
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Rating</th>
              <th className="text-left p-4">Review</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-12 text-brand-brown-light text-sm animate-pulse">Loading…</td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-brand-brown-light text-sm">No reviews found.</td></tr>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) : reviews.map((r: any) => (
              <tr key={r.id} className="border-b border-brand-surface">
                <td className="p-4 font-medium text-brand-brown">{r.name}</td>
                <td className="p-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-brand-yellow text-brand-yellow" />
                    ))}
                  </div>
                </td>
                <td className="p-4 text-brand-brown-mid max-w-xs truncate">{String(r.body).slice(0, 80)}…</td>
                <td className="p-4 text-brand-brown-mid">{formatDate(r.createdat)}</td>
                <td className="p-4"><StatusBadge status={r.status} /></td>
                <td className="p-4">
                  <div className="flex gap-2 flex-wrap">
                    <button type="button" onClick={() => updateStatus(r.id, "approved")} className="text-xs text-green-600 hover:underline">Approve</button>
                    <button type="button" onClick={() => updateStatus(r.id, "rejected")} className="text-xs text-red-500 hover:underline">Reject</button>
                    <button type="button" onClick={() => updateStatus(r.id, "flagged")} className="text-xs text-amber-600 hover:underline">Flag</button>
                    <button type="button" onClick={() => setDeleteTarget(r.id)} className="text-xs text-brand-brown-light hover:text-red-500 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={deleteReview}
        title="Delete Review"
        description="This will permanently delete this review. This action cannot be undone."
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}
