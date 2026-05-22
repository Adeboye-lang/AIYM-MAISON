"use client";

import { useState, useEffect } from "react";
import ChartWrapper from "@/components/admin/ChartWrapper";
import Button from "@/components/ui/Button";

export default function AdminInventory() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [action, setAction] = useState<"add" | "remove">("add");
  const [units, setUnits] = useState("");
  const [reason, setReason] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/inventory")
      .then((r) => r.json())
      .then((d) => {
        const list = d.products ?? [];
        setProducts(list);
        if (list.length > 0) setSelectedId(list[0].id);
      });
  }, []);

  const selected = products.find((p) => p.id === selectedId);
  const stockLevel = selected?.stockCount ?? 0;
  const threshold = selected?.lowStockAt ?? 10;

  const statusColor =
    stockLevel <= 0 ? "text-red-600"
    : stockLevel <= threshold ? "text-amber-600"
    : "text-green-600";
  const statusLabel =
    stockLevel <= 0 ? "Out of stock"
    : stockLevel <= threshold ? "Low"
    : "Healthy";

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    setSaving(true);
    const res = await fetch("/api/admin/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: selectedId, action, units, reason }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) {
      setProducts((prev) =>
        prev.map((p) => p.id === selectedId ? { ...p, stockCount: data.stockCount } : p)
      );
      setUnits("");
      setReason("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {products.length > 1 && (
        <div className="flex gap-3 items-center">
          <label className="text-xs uppercase tracking-widest text-brand-brown-light">Product</label>
          <select
            aria-label="Select product"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="border border-brand-brown-light bg-brand-white text-brand-brown px-4 py-2 text-sm outline-none focus:border-brand-yellow"
          >
            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      )}

      <div className="bg-brand-white border-t-[3px] border-brand-yellow p-8 text-center">
        <p className="font-display text-5xl md:text-7xl text-brand-yellow mb-2">{stockLevel}</p>
        <p className="text-brand-brown-light text-sm uppercase tracking-widest mb-2">units in stock</p>
        <p className={`text-sm font-medium uppercase tracking-wide ${statusColor}`}>{statusLabel}</p>
        {selected && <p className="text-xs text-brand-brown-light mt-1">{selected.name}</p>}
      </div>

      <ChartWrapper title="Stock Trend">
        <div className="flex items-center justify-center h-32 text-brand-brown-light text-sm">
          Stock history appears here once logged.
        </div>
      </ChartWrapper>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-brand-white border-t-[3px] border-brand-yellow p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-brand-brown-light">Update Stock</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="flex gap-4">
              {(["add", "remove"] as const).map((a) => (
                <label key={a} className="flex items-center gap-2 cursor-pointer text-sm text-brand-brown-mid">
                  <input
                    type="radio"
                    checked={action === a}
                    onChange={() => setAction(a)}
                    className="accent-brand-yellow"
                  />
                  {a === "add" ? "Add stock" : "Remove stock"}
                </label>
              ))}
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-brand-brown block mb-1">Units</label>
              <input
                type="number"
                min={1}
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                required
                placeholder="e.g. 50"
                className="w-full border border-brand-brown-light bg-brand-white text-brand-brown px-4 py-2.5 text-sm outline-none focus:border-brand-yellow"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-brand-brown block mb-1">Reason</label>
              <select
                aria-label="Select reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="w-full border border-brand-brown-light bg-brand-white text-brand-brown px-4 py-2.5 text-sm outline-none focus:border-brand-yellow"
              >
                <option value="">Select reason</option>
                <option>New stock received</option>
                <option>Damaged</option>
                <option>Returned</option>
                <option>Manual adjustment</option>
              </select>
            </div>
            <Button type="submit" variant="primary" fullWidth loading={saving}>Update Stock</Button>
            {saved && <p className="text-xs text-green-600">Stock updated.</p>}
          </form>
        </div>

        <div className="bg-brand-white border-t-[3px] border-brand-yellow p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-brand-brown-light">All Products</h2>
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-brand-surface">
                <p className="text-sm text-brand-brown">{p.name}</p>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${p.stockCount <= p.lowStockAt ? "text-amber-600" : "text-green-600"}`}>
                    {p.stockCount} units
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedId(p.id)}
                    className="text-xs text-brand-yellow hover:underline"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
