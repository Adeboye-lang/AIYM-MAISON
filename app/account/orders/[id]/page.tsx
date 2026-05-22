"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import OrderTimeline from "@/components/account/OrderTimeline";
import Button from "@/components/ui/Button";
import { formatDate, formatCurrency, isWithinDays } from "@/lib/utils";
import { OrderStatus } from "@/lib/types";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [returnOpen, setReturnOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [returnMessage, setReturnMessage] = useState("");
  const [returnSubmitted, setReturnSubmitted] = useState(false);
  const [returnLoading, setReturnLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/account/orders/${id}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then((d) => {
        if (d) { setOrder(d.order); setLoading(false); }
      })
      .catch(() => setLoading(false));
  }, [id]);

  const submitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    setReturnLoading(true);
    await fetch("/api/admin/returns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id, reason: returnReason, message: returnMessage }),
    });
    setReturnLoading(false);
    setReturnSubmitted(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-brand-brown-light text-sm uppercase tracking-widest animate-pulse">Loading…</p>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-brand-brown-mid text-sm mb-4">Order not found.</p>
        <Link href="/account/orders" className="text-brand-yellow hover:underline text-xs uppercase tracking-widest">
          Back to orders
        </Link>
      </div>
    );
  }

  const statusTitle = (order.status.charAt(0).toUpperCase() + order.status.slice(1)) as OrderStatus;
  const canReturn = order.status === "delivered" && isWithinDays(order.createdat, 14);
  const addr = order.shippingAddress ?? {};
  const firstItem = order.items?.[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link href="/account/orders" className="text-xs text-brand-yellow hover:underline uppercase tracking-wide">
            ← Orders
          </Link>
        </div>
        <h1 className="font-display text-3xl text-brand-brown mb-1">
          Order #{order.id.slice(0, 8).toUpperCase()}
        </h1>
        <p className="text-xs text-brand-brown-light">
          Placed on {formatDate(order.createdat)}
        </p>
        <div className="mt-3">
          <OrderStatusBadge status={statusTitle} />
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-brand-white p-6 border-t-[3px] border-brand-yellow">
        <OrderTimeline status={statusTitle} />
      </div>

      {/* Items */}
      <div className="bg-brand-white p-6 space-y-4">
        <h2 className="text-xs uppercase tracking-widest text-brand-brown font-medium">Order Items</h2>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {order.items?.map((item: any, i: number) => (
          <div key={i} className="flex gap-4 items-start py-3 border-b border-brand-surface last:border-0">
            <div className="w-16 h-16 bg-brand-surface shrink-0" />
            <div className="flex-1 text-sm">
              <p className="font-medium text-brand-brown">{item.name}</p>
              {item.variant && <p className="text-brand-brown-light text-xs mb-1">{item.variant}</p>}
              <p className="text-brand-brown-mid">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="text-brand-brown font-medium">{formatCurrency(item.price)}</p>
            </div>
          </div>
        ))}
        <div className="border-t border-brand-surface pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between font-display text-xl text-brand-brown pt-2 border-t border-brand-yellow">
            <span>Total</span><span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Delivery */}
      <div className="bg-brand-white p-6 space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-brand-brown font-medium">Delivery</h2>
        <div className="text-sm text-brand-brown-mid space-y-1">
          {addr.firstName && <p>{addr.firstName} {addr.lastName}</p>}
          {addr.line1 && <p>{addr.line1}{addr.city ? `, ${addr.city}` : ""}{addr.postcode ? ` ${addr.postcode}` : ""}</p>}
          {order.trackingNumber && (
            <div className="flex items-center gap-2 mt-2">
              <span>Tracking: {order.trackingNumber}</span>
              <a href="#" className="text-brand-yellow hover:underline inline-flex items-center gap-1 text-xs">
                Track <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
          {!addr.firstName && !firstItem && <p className="text-brand-brown-light">No delivery info available.</p>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="ghost">
          <Download className="h-4 w-4" />
          Download Invoice
        </Button>

        {canReturn && !returnOpen && !returnSubmitted && (
          <Button type="button" variant="accent" onClick={() => setReturnOpen(true)}>
            Request a Return
          </Button>
        )}
      </div>

      {/* Return form */}
      {returnOpen && !returnSubmitted && (
        <form onSubmit={submitReturn} className="bg-brand-white p-6 space-y-4 border-t-[3px] border-brand-yellow">
          <h2 className="text-xs uppercase tracking-widest text-brand-brown font-medium">Return Request</h2>
          <div>
            <label htmlFor="return-reason" className="text-xs uppercase tracking-widest text-brand-brown block mb-1">Reason</label>
            <select
              id="return-reason"
              className="w-full border border-brand-brown-light text-brand-brown px-4 py-3 text-sm outline-none focus:border-brand-yellow bg-brand-white"
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              required
            >
              <option value="">Select a reason</option>
              <option>Faulty item</option>
              <option>Changed mind</option>
              <option>Wrong item</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="return-message" className="text-xs uppercase tracking-widest text-brand-brown block mb-1">Additional message</label>
            <textarea
              id="return-message"
              className="w-full border border-brand-brown-light text-brand-brown px-4 py-3 text-sm outline-none focus:border-brand-yellow bg-brand-white resize-none"
              rows={3}
              value={returnMessage}
              onChange={(e) => setReturnMessage(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" loading={returnLoading}>Submit Return Request</Button>
        </form>
      )}

      {returnSubmitted && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
          Your return request has been received. We&apos;ll be in touch within 2–3 business days.
        </div>
      )}
    </div>
  );
}
