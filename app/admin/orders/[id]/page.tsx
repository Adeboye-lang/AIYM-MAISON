"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Button from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OrderStatus, PaymentStatus } from "@/lib/types";

interface OrderItem { id: string; name: string; price: number; quantity: number; variant?: string; }
interface OrderData {
  id: string; email: string; status: string; total: number; shipping: number;
  discount: number; trackingnumber?: string; adminnotes?: string;
  createdat: string; customer?: string; firstname?: string; lastname?: string;
  shippingaddress?: { line1?: string; line2?: string; city?: string; postcode?: string; country?: string } | null;
}

function fmt(addr: OrderData["shippingaddress"]) {
  if (!addr) return "—";
  return [addr.line1, addr.line2, addr.city, addr.postcode, addr.country].filter(Boolean).join(", ");
}

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [trackingNumber, setTrackingNumber] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<OrderStatus>("Processing");
  const [saving, setSaving] = useState(false);

  const [dispatchModal, setDispatchModal] = useState(false);
  const [refundModal, setRefundModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/orders/${id}`);
    if (!res.ok) { setLoading(false); return; }
    const data = await res.json();
    setOrder(data.order);
    setItems(data.items ?? []);
    const s = (data.order.status ?? "processing") as string;
    setStatus((s.charAt(0).toUpperCase() + s.slice(1)) as OrderStatus);
    setTrackingNumber(data.order.trackingnumber ?? "");
    setNote(data.order.adminnotes ?? "");
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const patch = async (body: object) => {
    setSaving(true);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
  };

  const handleStatusChange = async (s: OrderStatus) => {
    setStatus(s);
    await patch({ status: s.toLowerCase() });
  };

  const handleSaveTracking = () => patch({ trackingNumber });
  const handleSaveNote = () => patch({ adminNotes: note });

  const handleDispatch = async () => {
    await patch({ status: "dispatched", trackingNumber });
    setStatus("Dispatched");
    setDispatchModal(false);
  };

  const handleRefund = async () => {
    await patch({ status: "refunded" });
    setStatus("Refunded");
    setRefundModal(false);
  };

  const handleCancel = async () => {
    await patch({ status: "cancelled" });
    setStatus("Cancelled");
    setCancelModal(false);
  };

  if (loading) return <div className="text-sm text-brand-brown-light p-6">Loading order...</div>;
  if (!order) return <div className="text-sm text-red-500 p-6">Order not found.</div>;

  const customerName = order.customer || order.email;
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const vat = (order.total - (order.shipping ?? 0)) * (1 - 1 / 1.2);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-display text-3xl text-brand-brown">Order AIYM-{order.id.slice(0, 8).toUpperCase()}</h1>
          <StatusBadge status={"Paid" as PaymentStatus} />
          <StatusBadge status={status} />
        </div>
        <p className="text-xs text-brand-brown-light mt-1">Placed {formatDate(order.createdat)}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Customer */}
          <div className="bg-brand-white border-t-[3px] border-brand-yellow p-5">
            <h2 className="text-xs uppercase tracking-widest text-brand-brown-light mb-3">Customer</h2>
            <p className="text-sm font-medium text-brand-brown">{customerName}</p>
            <p className="text-xs text-brand-brown-mid">{order.email}</p>
          </div>

          {/* Items */}
          <div className="bg-brand-white border-t-[3px] border-brand-yellow p-5 space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-brand-brown-light">Order Items</h2>
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 items-start">
                <div className="w-14 h-14 bg-brand-surface flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-brand-brown">{item.name}</p>
                  {item.variant && <p className="text-xs text-brand-brown-light">{item.variant}</p>}
                  <p className="text-xs text-brand-brown-mid">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm text-brand-brown">{formatCurrency(item.price)}</p>
              </div>
            ))}
            <div className="border-t border-brand-surface pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-brand-brown-mid">
                <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-brand-brown-mid">
                <span>Shipping</span><span>{order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span><span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-brand-brown-mid">
                <span>VAT (incl.)</span><span>{formatCurrency(vat)}</span>
              </div>
              <div className="flex justify-between font-display text-xl text-brand-brown border-t border-brand-yellow pt-2">
                <span>Grand Total</span><span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-brand-white border-t-[3px] border-brand-yellow p-5 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-brand-brown-light">Shipping</h2>
            <p className="text-sm text-brand-brown-mid">{fmt(order.shippingaddress)}</p>
            <div className="flex gap-3 items-center">
              <input
                placeholder="Tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="flex-1 border border-brand-brown-light text-brand-brown px-3 py-2 text-sm outline-none focus:border-brand-yellow bg-brand-white"
              />
              <button
                type="button"
                onClick={handleSaveTracking}
                disabled={saving}
                className="text-xs text-brand-yellow hover:underline uppercase tracking-wide disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <div className="bg-brand-white border-t-[3px] border-brand-yellow p-5 space-y-4 lg:sticky lg:top-20">
            <h2 className="text-xs uppercase tracking-widest text-brand-brown-light">Actions</h2>

            <div>
              <label className="text-xs uppercase tracking-widest text-brand-brown block mb-1">Update Status</label>
              <select
                title="Update order status"
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                className="w-full border border-brand-brown-light bg-brand-white text-brand-brown px-3 py-2 text-sm outline-none focus:border-brand-yellow"
              >
                {["Processing", "Dispatched", "Delivered", "Refunded", "Cancelled"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <Button variant="primary" fullWidth onClick={() => setDispatchModal(true)}>
              Mark as Dispatched
            </Button>

            <button
              type="button"
              onClick={() => setRefundModal(true)}
              className="w-full border border-amber-400 text-amber-700 text-xs uppercase tracking-widest py-3 hover:bg-amber-50 transition-colors"
            >
              Process Refund
            </button>

            <button
              type="button"
              onClick={() => setCancelModal(true)}
              className="w-full border border-red-300 text-red-600 text-xs uppercase tracking-widest py-3 hover:bg-red-50 transition-colors"
            >
              Cancel Order
            </button>

            <div className="border-t border-brand-surface pt-4">
              <label className="text-xs uppercase tracking-widest text-brand-brown block mb-2">Admin Notes</label>
              <textarea
                rows={3}
                placeholder="Internal note (not visible to customer)..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-brand-brown-light bg-brand-white text-brand-brown px-3 py-2 text-sm outline-none focus:border-brand-yellow resize-none"
              />
              <button
                type="button"
                onClick={handleSaveNote}
                disabled={saving}
                className="text-xs text-brand-yellow hover:underline mt-1 disabled:opacity-50"
              >
                Save Note
              </button>
            </div>

            <Link
              href="/admin/orders"
              className="block text-center text-xs text-brand-brown-light hover:text-brand-brown mt-2"
            >
              ← Back to Orders
            </Link>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={dispatchModal}
        onClose={() => setDispatchModal(false)}
        onConfirm={handleDispatch}
        title="Mark as Dispatched"
        description="This will mark the order as dispatched and save the tracking number."
        confirmLabel="Mark Dispatched"
      />
      <ConfirmModal
        open={refundModal}
        onClose={() => setRefundModal(false)}
        onConfirm={handleRefund}
        title="Process Refund"
        description={`Mark this order as refunded? Total: ${formatCurrency(order.total)}`}
        confirmLabel="Confirm Refund"
        destructive
      />
      <ConfirmModal
        open={cancelModal}
        onClose={() => setCancelModal(false)}
        onConfirm={handleCancel}
        title="Cancel Order"
        description="Are you sure you want to cancel this order? This cannot be undone."
        confirmLabel="Cancel Order"
        destructive
      />
    </div>
  );
}
