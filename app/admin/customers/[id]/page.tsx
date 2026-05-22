"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { formatDate, formatCurrency } from "@/lib/utils";
import { OrderStatus } from "@/lib/types";
import { Check, X } from "lucide-react";

const mockCustomer = {
  id: "1",
  firstName: "Zara",
  lastName: "M.",
  email: "zara@example.com",
  phone: "07700 900456",
  joinDate: "2026-03-10T12:00:00Z",
  lastLogin: "2026-05-18T09:00:00Z",
  totalOrders: 3,
  totalSpent: 82.0,
  avgOrderValue: 27.33,
  marketing: true,
  status: "Active",
};

const mockOrders = [
  { id: "1003", date: "2026-05-19T10:00:00Z", variant: "Foam + Mitts", total: 28.0, status: "Processing" as OrderStatus },
  { id: "1001", date: "2026-04-10T12:00:00Z", variant: "Foam + Mitts", total: 28.0, status: "Delivered" as OrderStatus },
];

export default function AdminCustomerDetail() {
  const [note, setNote] = useState("");
  const [suspendModal, setSuspendModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="font-display text-3xl text-brand-brown">
          {mockCustomer.firstName} {mockCustomer.lastName}
        </h1>
        <StatusBadge status={mockCustomer.status} />
        <p className="text-xs text-brand-brown-light">Member since {formatDate(mockCustomer.joinDate)}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — profile */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-brand-white border-t-[3px] border-brand-yellow p-5 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-brand-brown-light">Profile</h2>
            <div className="grid sm:grid-cols-2 gap-y-2 text-sm">
              <div><span className="text-brand-brown-light">Name:</span> <span className="text-brand-brown">{mockCustomer.firstName} {mockCustomer.lastName}</span></div>
              <div><span className="text-brand-brown-light">Email:</span> <span className="text-brand-brown">{mockCustomer.email}</span></div>
              <div><span className="text-brand-brown-light">Phone:</span> <span className="text-brand-brown">{mockCustomer.phone}</span></div>
              <div><span className="text-brand-brown-light">Last login:</span> <span className="text-brand-brown">{formatDate(mockCustomer.lastLogin)}</span></div>
              <div className="flex items-center gap-2">
                <span className="text-brand-brown-light">Marketing:</span>
                {mockCustomer.marketing ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-brand-brown-light" />}
              </div>
            </div>
          </div>

          <div className="bg-brand-white border-t-[3px] border-brand-yellow p-5 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-brand-brown-light">Admin Notes</h2>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Internal notes about this customer..."
              className="w-full border border-brand-brown-light bg-brand-white text-brand-brown px-3 py-2 text-sm outline-none focus:border-brand-yellow resize-none"
            />
            <button className="text-xs text-brand-yellow hover:underline uppercase tracking-wide">Save</button>
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
                  <th className="text-left p-4">Variant</th>
                  <th className="text-left p-4">Total</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4" />
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((o) => (
                  <tr key={o.id} className="border-b border-brand-surface">
                    <td className="p-4 font-medium text-brand-brown">AIYM-{o.id}</td>
                    <td className="p-4 text-brand-brown-mid">{formatDate(o.date)}</td>
                    <td className="p-4 text-brand-brown-mid">{o.variant}</td>
                    <td className="p-4 text-brand-brown">{formatCurrency(o.total)}</td>
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
              <div className="flex justify-between"><span className="text-brand-brown-light">Total orders</span><span className="text-brand-brown font-medium">{mockCustomer.totalOrders}</span></div>
              <div className="flex justify-between"><span className="text-brand-brown-light">Total spent</span><span className="text-brand-brown font-medium">{formatCurrency(mockCustomer.totalSpent)}</span></div>
              <div className="flex justify-between"><span className="text-brand-brown-light">Avg order value</span><span className="text-brand-brown font-medium">{formatCurrency(mockCustomer.avgOrderValue)}</span></div>
            </div>
          </div>

          <div className="bg-brand-white border-t-[3px] border-brand-yellow p-5 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-brand-brown-light">Actions</h2>
            <a
              href={`mailto:support@maisonaiym.com?subject=Re: ${mockCustomer.firstName}`}
              className="block w-full border border-brand-brown-light text-brand-brown text-xs uppercase tracking-widest py-3 text-center hover:bg-brand-surface transition-colors"
            >
              Send Email
            </a>
            <button
              onClick={() => setSuspendModal(true)}
              className="w-full border border-red-300 text-red-600 text-xs uppercase tracking-widest py-3 hover:bg-red-50 transition-colors"
            >
              Suspend Account
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={suspendModal}
        onClose={() => setSuspendModal(false)}
        onConfirm={() => setSuspendModal(false)}
        title="Suspend Account"
        description="This will suspend this customer's account. They will not be able to log in."
        confirmLabel="Suspend"
        destructive
      />
    </div>
  );
}
