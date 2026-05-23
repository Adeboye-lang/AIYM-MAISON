"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Check, X } from "lucide-react";

export default function AdminCustomerDetail() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customer, setCustomer] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);
  const [suspendModal, setSuspendModal] = useState(false);
  const params = useParams();
  const id = params.id as string;

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/customers/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setCustomer(d.customer);
        setOrders(d.orders ?? []);
        setNote(d.customer?.adminnotes ?? "");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const saveNote = async () => {
    setNoteSaving(true);
    await fetch(`/api/admin/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminNotes: note }),
    });
    setNoteSaving(false);
  };

  const handleSuspend = async () => {
    await fetch(`/api/admin/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suspended: !customer?.suspended }),
    });
    setSuspendModal(false);
    load();
  };

  if (loading) return <div className="text-brand-brown-light text-sm animate-pulse py-12 text-center">Loading…</div>;
  if (!customer) return <div className="text-brand-brown-light text-sm py-12 text-center">Customer not found.</div>;

  const fullName = `${customer.firstname ?? ""} ${customer.lastname ?? ""}`.trim();
  const status = customer.suspended ? "Suspended" : "Active";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="font-display text-3xl text-brand-brown">{fullName}</h1>
        <StatusBadge status={status} />
        <p className="text-xs text-brand-brown-light">Member since {formatDate(customer.createdat)}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Profile */}
          <div className="bg-brand-white border-t-[3px] border-brand-yellow p-5 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-brand-brown-light">Profile</h2>
            <div className="grid sm:grid-cols-2 gap-y-2 text-sm">
              <div><span className="text-brand-brown-light">Name: </span><span className="text-brand-brown">{fullName}</span></div>
              <div><span className="text-brand-brown-light">Email: </span><span className="text-brand-brown">{customer.email}</span></div>
              {customer.phone && <div><span className="text-brand-brown-light">Phone: </span><span className="text-brand-brown">{customer.phone}</span></div>}
              <div><span className="text-brand-brown-light">Last login: </span><span className="text-brand-brown">{customer.lastloginat ? formatDate(customer.lastloginat) : "Never"}</span></div>
              <div className="flex items-center gap-2">
                <span className="text-brand-brown-light">Email verified: </span>
                {customer.emailverified ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-brand-brown-light" />}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-brown-light">Marketing: </span>
                {customer.marketing ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-brand-brown-light" />}
              </div>
            </div>
          </div>

          {/* Admin notes */}
          <div className="bg-brand-white border-t-[3px] border-brand-yellow p-5 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-brand-brown-light">Admin Notes</h2>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Internal notes about this customer..."
              className="w-full border border-brand-brown-light bg-brand-white text-brand-brown px-3 py-2 text-sm outline-none focus:border-brand-yellow resize-none"
            />
            <button
              type="button"
              onClick={saveNote}
              disabled={noteSaving}
              className="text-xs text-brand-yellow hover:underline uppercase tracking-wide disabled:opacity-50"
            >
              {noteSaving ? "Saving…" : "Save"}
            </button>
          </div>

          {/* Orders */}
          <div className="bg-brand-white border-t-[3px] border-brand-yellow overflow-x-auto">
            <div className="p-5 border-b border-brand-surface">
              <h2 className="text-xs uppercase tracking-widest text-brand-brown-light">Order History</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-yellow text-[10px] uppercase tracking-widest text-brand-brown-light">
                  <th className="text-left p-4">Order #</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Item</th>
                  <th className="text-left p-4">Total</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4 sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={6} className="p-4 text-center text-brand-brown-light text-xs">No orders yet.</td></tr>
                ) : orders.map((o) => (
                  <tr key={o.id} className="border-b border-brand-surface">
                    <td className="p-4 font-medium text-brand-brown text-xs">#{o.id.slice(0, 8).toUpperCase()}</td>
                    <td className="p-4 text-brand-brown-mid text-xs">{formatDate(o.createdat)}</td>
                    <td className="p-4 text-brand-brown-mid text-xs">{o.variant ?? "—"}</td>
                    <td className="p-4 text-brand-brown text-xs">{formatCurrency(o.total)}</td>
                    <td className="p-4"><StatusBadge status={o.status} /></td>
                    <td className="p-4">
                      <Link href={`/admin/orders/${o.id}`} className="text-xs text-brand-yellow hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right — stats + actions */}
        <div className="space-y-4">
          <div className="bg-brand-white border-t-[3px] border-brand-yellow p-5 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-brand-brown-light">Lifetime Stats</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-brand-brown-light">Total orders</span><span className="text-brand-brown font-medium">{customer.order_count}</span></div>
              <div className="flex justify-between"><span className="text-brand-brown-light">Total spent</span><span className="text-brand-brown font-medium">{formatCurrency(customer.total_spent)}</span></div>
              <div className="flex justify-between"><span className="text-brand-brown-light">Avg order value</span><span className="text-brand-brown font-medium">{formatCurrency(customer.avg_order_value)}</span></div>
            </div>
          </div>

          <div className="bg-brand-white border-t-[3px] border-brand-yellow p-5 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-brand-brown-light">Actions</h2>
            <a
              href={`mailto:${customer.email}`}
              className="block w-full border border-brand-brown-light text-brand-brown text-xs uppercase tracking-widest py-3 text-center hover:bg-brand-surface transition-colors"
            >
              Send Email
            </a>
            <button
              type="button"
              onClick={() => setSuspendModal(true)}
              className="w-full border border-red-300 text-red-600 text-xs uppercase tracking-widest py-3 hover:bg-red-50 transition-colors"
            >
              {customer.suspended ? "Unsuspend Account" : "Suspend Account"}
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={suspendModal}
        onClose={() => setSuspendModal(false)}
        onConfirm={handleSuspend}
        title={customer.suspended ? "Unsuspend Account" : "Suspend Account"}
        description={customer.suspended ? "This will restore this customer's access." : "This will prevent this customer from logging in."}
        confirmLabel={customer.suspended ? "Unsuspend" : "Suspend"}
        destructive={!customer.suspended}
      />
    </div>
  );
}
