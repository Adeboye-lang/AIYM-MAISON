"use client";

import { useState, useEffect, useCallback } from "react";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Button from "@/components/ui/Button";
import { Download, Send } from "lucide-react";
import { formatDate } from "@/lib/utils";

const tabs = ["Active", "Unsubscribed", "All"];

function SendNewsletterForm({ subscriberCount }: { subscriberCount: number }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [open, setOpen] = useState(false);

  const handleSend = async () => {
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ type: "success", text: `Sent to ${data.sent} subscriber${data.sent !== 1 ? "s" : ""}.` });
        setSubject("");
        setBody("");
        setOpen(false);
      } else {
        setResult({ type: "error", text: data.error ?? "Failed to send." });
      }
    } catch {
      setResult({ type: "error", text: "Network error. Try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-brand-white border-t-[3px] border-brand-yellow p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs uppercase tracking-widest text-brand-brown font-medium">Send Newsletter</h2>
          <p className="text-xs text-brand-brown-light mt-0.5">{subscriberCount} active subscriber{subscriberCount !== 1 ? "s" : ""}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 text-xs uppercase tracking-wide text-brand-yellow hover:underline"
        >
          <Send className="h-3.5 w-3.5" />
          {open ? "Cancel" : "Compose"}
        </button>
      </div>

      {result && (
        <p className={`text-xs px-4 py-2 ${result.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
          {result.text}
        </p>
      )}

      {open && (
        <div className="space-y-4 pt-2 border-t border-brand-surface">
          <div>
            <label className="text-xs uppercase tracking-widest text-brand-brown block mb-1">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. New arrivals from Maison AIYM"
              className="w-full border border-brand-brown-light bg-brand-white text-brand-brown px-4 py-2.5 text-sm outline-none focus:border-brand-yellow"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-brand-brown block mb-1">Message</label>
            <textarea
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your newsletter message here…"
              className="w-full border border-brand-brown-light bg-brand-white text-brand-brown px-4 py-2.5 text-sm outline-none focus:border-brand-yellow resize-none"
            />
          </div>
          <Button
            variant="primary"
            onClick={handleSend}
            loading={sending}
            disabled={!subject.trim() || !body.trim()}
          >
            Send to {subscriberCount} Subscriber{subscriberCount !== 1 ? "s" : ""}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function AdminNewsletter() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Active");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subscribers, setSubscribers] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/newsletter?search=${encodeURIComponent(search)}&tab=${encodeURIComponent(activeTab)}`)
      .then((r) => r.json())
      .then((d) => { setSubscribers(d.subscribers ?? []); setStats(d.stats ?? {}); })
      .finally(() => setLoading(false));
  }, [search, activeTab]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const removeSubscriber = async () => {
    if (!removeTarget) return;
    await fetch("/api/admin/newsletter", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: removeTarget }),
    });
    setRemoveTarget(null);
    load();
  };

  const activeCount = parseInt(String(stats.active_count ?? "0"));

  return (
    <div className="space-y-6">
      <SendNewsletterForm subscriberCount={activeCount} />

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-brand-white border-t-[3px] border-brand-yellow p-5">
          <p className="text-xs uppercase tracking-widest text-brand-brown-light mb-1">Total Subscribers</p>
          <p className="font-display text-3xl text-brand-brown">{stats.active_count ?? 0}</p>
        </div>
        <div className="bg-brand-white border-t-[3px] border-brand-yellow p-5">
          <p className="text-xs uppercase tracking-widest text-brand-brown-light mb-1">New This Week</p>
          <p className="font-display text-3xl text-brand-brown">{stats.new_this_week ?? 0}</p>
        </div>
        <div className="bg-brand-white border-t-[3px] border-brand-yellow p-5">
          <p className="text-xs uppercase tracking-widest text-brand-brown-light mb-1">Unsubscribed</p>
          <p className="font-display text-3xl text-brand-brown">{stats.unsubscribed_count ?? 0}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
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
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-brand-brown-light bg-brand-white text-brand-brown px-4 py-2 text-sm outline-none focus:border-brand-yellow w-56"
        />
        <button type="button" className="flex items-center gap-2 border border-brand-brown-light text-brand-brown px-4 py-2 text-xs uppercase tracking-wide hover:bg-brand-surface transition-colors ml-auto">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      <div className="bg-brand-white border-t-[3px] border-brand-yellow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-yellow text-[10px] uppercase tracking-widest text-brand-brown-light">
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Source</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4 sr-only">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-12 text-brand-brown-light text-sm animate-pulse">Loading…</td></tr>
            ) : subscribers.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-brand-brown-light text-sm">No subscribers found.</td></tr>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) : subscribers.map((s: any) => (
              <tr key={s.id} className="border-b border-brand-surface">
                <td className="p-4 font-medium text-brand-brown">{s.name ?? "—"}</td>
                <td className="p-4 text-brand-brown-mid text-xs">{s.email}</td>
                <td className="p-4 text-brand-brown-mid">{formatDate(s.createdat)}</td>
                <td className="p-4 text-brand-brown-mid capitalize">{s.source}</td>
                <td className="p-4"><StatusBadge status={s.active ? "active" : "unsubscribed"} /></td>
                <td className="p-4">
                  {s.active && (
                    <button
                      type="button"
                      onClick={() => setRemoveTarget(s.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={removeSubscriber}
        title="Remove Subscriber"
        description="This will unsubscribe this contact. Their record will be retained for compliance."
        confirmLabel="Remove"
        destructive
      />
    </div>
  );
}
