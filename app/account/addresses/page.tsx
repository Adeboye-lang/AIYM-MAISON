"use client";

import { useState, useEffect } from "react";
import AddressCard from "@/components/account/AddressCard";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Address } from "@/lib/types";

const EMPTY: Partial<Address> = { country: "GB" };

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Address>>(EMPTY);

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    fetch("/api/account/addresses")
      .then((r) => r.ok ? r.json() : { addresses: [] })
      .then((d) => setAddresses(d.addresses ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, isDefault: addresses.length === 0 }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const { id } = await res.json();
      const newAddr: Address = {
        id,
        firstName: form.firstName || "",
        lastName: form.lastName || "",
        line1: form.line1 || "",
        line2: form.line2,
        city: form.city || "",
        postcode: form.postcode || "",
        country: "GB",
        phone: form.phone || "",
        isDefault: addresses.length === 0,
      };
      setAddresses((prev) => [...prev, newAddr]);
      setModalOpen(false);
      setForm(EMPTY);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = async (id: string) => {
    await fetch(`/api/account/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-4xl text-brand-brown uppercase mb-2">My Addresses</h1>
        <div className="h-px bg-brand-yellow w-full" />
      </div>

      {loading ? (
        <p className="text-sm text-brand-brown-light">Loading...</p>
      ) : addresses.length === 0 ? (
        <p className="text-sm text-brand-brown-mid">No saved addresses yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onDelete={() => handleDelete(addr.id)}
              onSetDefault={() => handleSetDefault(addr.id)}
            />
          ))}
        </div>
      )}

      <Button variant="primary" onClick={() => setModalOpen(true)}>
        Add New Address
      </Button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Address" maxWidth="max-w-lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="First name" value={form.firstName || ""} onChange={(e) => set("firstName", e.target.value)} required />
            <Input label="Last name" value={form.lastName || ""} onChange={(e) => set("lastName", e.target.value)} required />
          </div>
          <Input label="Address line 1" value={form.line1 || ""} onChange={(e) => set("line1", e.target.value)} required />
          <Input label="Address line 2" value={form.line2 || ""} onChange={(e) => set("line2", e.target.value)} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="City" value={form.city || ""} onChange={(e) => set("city", e.target.value)} required />
            <Input label="Postcode" value={form.postcode || ""} onChange={(e) => set("postcode", e.target.value)} required />
          </div>
          <Input label="Country" value="United Kingdom" readOnly />
          <Input label="Phone number" type="tel" value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} required />
          <Button type="submit" variant="primary" fullWidth disabled={saving}>
            {saving ? "Saving..." : "Save Address"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
