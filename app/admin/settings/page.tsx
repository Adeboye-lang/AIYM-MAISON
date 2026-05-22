"use client";

import { useState, useEffect } from "react";
import Tabs from "@/components/ui/Tabs";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

function StoreTab() {
  const [saved, setSaved] = useState(false);
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2000); }} className="space-y-4 max-w-lg">
      <Input label="Store name" defaultValue="Maison AIYM" />
      <Input label="Support email" type="email" defaultValue="support@maisonaiym.com" />
      <Input label="Website" defaultValue="maisonaiym.com" />
      <Input label="Currency" defaultValue="GBP £" readOnly />
      <Input label="VAT number" placeholder="GB000000000" />
      <div>
        <label className="text-xs uppercase tracking-widest text-brand-brown block mb-1">Business Address</label>
        <textarea rows={3} className="w-full border border-brand-brown-light bg-brand-white text-brand-brown px-4 py-3 text-sm outline-none focus:border-brand-yellow resize-none" placeholder="123 Maison Street&#10;London&#10;E1 6RF" />
      </div>
      <Button type="submit" variant="primary">Save Changes</Button>
      {saved && <p className="text-xs text-green-600">Saved.</p>}
    </form>
  );
}

function ShippingTab() {
  const [saved, setSaved] = useState(false);
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2000); }} className="space-y-4 max-w-lg">
      <Input label="Free delivery threshold (£)" type="number" defaultValue="40" step="0.01" />
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-brand-brown">Available Methods</p>
        {["Royal Mail 1st Class Tracked", "Royal Mail 2nd Class Tracked"].map((m) => (
          <label key={m} className="flex items-center gap-3 cursor-pointer text-sm text-brand-brown-mid">
            <input type="checkbox" defaultChecked className="accent-brand-yellow" />
            {m}
          </label>
        ))}
      </div>
      <Button type="submit" variant="primary">Save</Button>
      {saved && <p className="text-xs text-green-600">Saved.</p>}
    </form>
  );
}

function NotificationsTab() {
  return (
    <div className="space-y-4 max-w-lg">
      {[
        "New order placed",
        "Order dispatched",
        "New return request",
        "Low stock alert",
        "New customer signup",
      ].map((label) => (
        <label key={label} className="flex items-center justify-between gap-4 cursor-pointer">
          <span className="text-sm text-brand-brown-mid">{label}</span>
          <div className="relative w-12 h-6 bg-brand-yellow flex-shrink-0">
            <div className="absolute top-1 right-1 w-4 h-4 bg-brand-white" />
          </div>
        </label>
      ))}
      <Button variant="primary">Save Preferences</Button>
    </div>
  );
}

interface DiscountRow { id: string; code: string; type: string; value: number; uses: number; maxuses: number | null; active: boolean; }

function DiscountsTab() {
  const [codes, setCodes] = useState<DiscountRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", type: "percentage", value: "", minOrder: "", maxUses: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/discounts").then((r) => r.ok ? r.json() : { codes: [] }).then((d) => setCodes(d.codes ?? []));
  }, []);

  const handleToggle = async (id: string, active: boolean) => {
    await fetch("/api/admin/discounts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, active: !active }) });
    setCodes((prev) => prev.map((c) => c.id === id ? { ...c, active: !active } : c));
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/admin/discounts", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setCodes((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: form.code, type: form.type, value: parseFloat(form.value), minOrder: parseFloat(form.minOrder) || 0, maxUses: form.maxUses ? parseInt(form.maxUses) : null }),
    });
    if (res.ok) {
      const { id } = await res.json();
      setCodes((prev) => [...prev, { id, code: form.code.toUpperCase(), type: form.type, value: parseFloat(form.value), uses: 0, maxuses: form.maxUses ? parseInt(form.maxUses) : null, active: true }]);
      setShowForm(false);
      setForm({ code: "", type: "percentage", value: "", minOrder: "", maxUses: "" });
    }
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto bg-brand-white border-t-[3px] border-brand-yellow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-yellow text-[10px] uppercase tracking-widest text-brand-brown-light">
              <th className="text-left p-4">Code</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Value</th>
              <th className="text-left p-4">Uses</th>
              <th className="text-left p-4">Active</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 && <tr><td colSpan={6} className="p-4 text-brand-brown-light text-xs">No discount codes yet.</td></tr>}
            {codes.map((c) => (
              <tr key={c.id} className="border-b border-brand-surface">
                <td className="p-4 font-medium text-brand-brown">{c.code}</td>
                <td className="p-4 text-brand-brown-mid capitalize">{c.type}</td>
                <td className="p-4 text-brand-brown">{c.type === "percentage" ? `${c.value}%` : `£${c.value.toFixed(2)}`}</td>
                <td className="p-4 text-brand-brown-mid">{c.uses}{c.maxuses ? `/${c.maxuses}` : ""}</td>
                <td className="p-4">
                  <span className={`text-xs font-medium ${c.active ? "text-green-600" : "text-brand-brown-light"}`}>{c.active ? "Yes" : "No"}</span>
                </td>
                <td className="p-4 flex gap-3">
                  <button type="button" onClick={() => handleToggle(c.id, c.active)} className="text-xs text-brand-yellow hover:underline">{c.active ? "Disable" : "Enable"}</button>
                  <button type="button" onClick={() => handleDelete(c.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm ? (
        <form onSubmit={handleCreate} className="bg-brand-white border-t-[3px] border-brand-yellow p-5 space-y-3 max-w-md">
          <p className="text-xs uppercase tracking-widest text-brand-brown-light mb-2">New Discount Code</p>
          <Input label="Code (e.g. SUMMER20)" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} required />
          <div>
            <label className="text-xs uppercase tracking-widest text-brand-brown block mb-1">Type</label>
            <select title="Discount type" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="w-full border border-brand-brown-light bg-brand-white text-brand-brown px-3 py-2 text-sm outline-none focus:border-brand-yellow">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (£)</option>
            </select>
          </div>
          <Input label={form.type === "percentage" ? "Value (%)" : "Value (£)"} type="number" step="0.01" min="0" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} required />
          <Input label="Min order (£, optional)" type="number" step="0.01" min="0" value={form.minOrder} onChange={(e) => setForm((f) => ({ ...f, minOrder: e.target.value }))} />
          <Input label="Max uses (optional)" type="number" min="1" value={form.maxUses} onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))} />
          <div className="flex gap-3">
            <Button type="submit" variant="primary" disabled={saving}>{saving ? "Creating..." : "Create Code"}</Button>
            <button type="button" onClick={() => setShowForm(false)} className="text-xs text-brand-brown-light hover:text-brand-brown">Cancel</button>
          </div>
        </form>
      ) : (
        <Button variant="primary" onClick={() => setShowForm(true)}>Create Discount Code</Button>
      )}
    </div>
  );
}

function AdminUsersTab() {
  return (
    <div className="space-y-4 max-w-lg">
      <p className="text-sm text-brand-brown-mid">Admin accounts are created by the Owner only.</p>
      <div className="bg-brand-white border-t-[3px] border-brand-yellow p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-yellow flex items-center justify-center text-brand-brown font-bold text-sm">AU</div>
          <div>
            <p className="text-sm font-medium text-brand-brown">Admin User</p>
            <p className="text-xs text-brand-brown-light">admin@maisonaiym.com — Owner</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationsTab() {
  const integrations = [
    { name: "Stripe", status: "Connected", note: "Live mode — payments processing", connected: true },
    { name: "Resend", status: "Connected", note: "Transactional emails via Resend API", connected: true },
    { name: "Neon Postgres", status: "Connected", note: "Database — orders, customers, reviews", connected: true },
    { name: "Google Analytics", status: "Not connected", note: "Add GA4 Measurement ID to enable", connected: false },
  ];
  return (
    <div className="space-y-3 max-w-lg">
      {integrations.map((i) => (
        <div key={i.name} className="bg-brand-white border-t-[3px] border-brand-yellow p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-brand-brown">{i.name}</p>
            <p className="text-xs text-brand-brown-light">{i.note}</p>
          </div>
          <span className={`text-xs uppercase tracking-wide font-medium ${i.connected ? "text-green-600" : "text-amber-600"}`}>{i.status}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminSettings() {
  const tabs = [
    { label: "Store", content: <StoreTab /> },
    { label: "Shipping", content: <ShippingTab /> },
    { label: "Notifications", content: <NotificationsTab /> },
    { label: "Discounts", content: <DiscountsTab /> },
    { label: "Admin Users", content: <AdminUsersTab /> },
    { label: "Integrations", content: <IntegrationsTab /> },
  ];

  return <Tabs tabs={tabs} />;
}
