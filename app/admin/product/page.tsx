"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Button from "@/components/ui/Button";
import { product } from "@/lib/constants";
import { Upload } from "lucide-react";

export default function AdminProduct() {
  const [published, setPublished] = useState(true);
  const [unpublishModal, setUnpublishModal] = useState(false);
  const [name, setName] = useState(product.name);
  const [tagline, setTagline] = useState(product.tagline);
  const [description, setDescription] = useState(product.description);
  const [application, setApplication] = useState(product.application);
  const [develop, setDevelop] = useState(product.develop);
  const [maintenance, setMaintenance] = useState(product.maintenance);
  const [ingredients, setIngredients] = useState(product.ingredients);
  const [storage, setStorage] = useState(product.storage);
  const [badges, setBadges] = useState([...product.badges]);
  const [metaTitle, setMetaTitle] = useState("Nubian Velvet Tanning Mousse — AIYM");
  const [metaDesc, setMetaDesc] = useState(product.description.slice(0, 160));
  const [prices, setPrices] = useState<Record<string, number>>({
    "foam-only": 26.0,
    "foam-with-mitts": 28.0,
  });
  const [priceSaving, setPriceSaving] = useState<Record<string, boolean>>({});
  const [priceSaved, setPriceSaved] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  // Image upload state per variant
  const [images, setImages] = useState<Record<string, string>>({
    "foam-only": "/images/Main Product.jpg",
    "foam-with-mitts": "/images/Mittens.png",
  });
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Load current prices and images from DB
  useEffect(() => {
    fetch("/api/product")
      .then((r) => r.json())
      .then((d) => {
        if (!d.variants) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        d.variants.forEach((v: any) => {
          if (v.variantKey) {
            setPrices((prev) => ({ ...prev, [v.variantKey]: v.price }));
            if (v.images?.[0]) {
              setImages((prev) => ({ ...prev, [v.variantKey]: v.images[0] }));
            }
          }
        });
      })
      .catch(() => {});
  }, []);

  const handleSavePrice = async (variantId: string) => {
    setPriceSaving((prev) => ({ ...prev, [variantId]: true }));
    await fetch("/api/product", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantKey: variantId, price: prices[variantId] }),
    });
    setPriceSaving((prev) => ({ ...prev, [variantId]: false }));
    setPriceSaved((prev) => ({ ...prev, [variantId]: true }));
    setTimeout(() => setPriceSaved((prev) => ({ ...prev, [variantId]: false })), 2000);
  };

  const handleImageUpload = async (variantId: string, file: File) => {
    setUploading((prev) => ({ ...prev, [variantId]: true }));
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();
    setUploading((prev) => ({ ...prev, [variantId]: false }));
    if (res.ok && data.url) {
      setImages((prev) => ({ ...prev, [variantId]: data.url }));
      await fetch("/api/product", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantKey: variantId, image: data.url }),
      });
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleBadge = (badge: string) => {
    setBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  const allBadges = ["Vegan", "Cruelty Free", "Quick Drying", "Fragrance Friendly"];

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <div className="bg-brand-white border-t-[3px] border-brand-yellow p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-brown-light mb-3">Product Images</p>
            <div className="flex gap-4 flex-wrap">
              {product.variants.map((v) => (
                <div key={v.id} className="flex flex-col items-center gap-2">
                  <div className="relative w-20 h-20 bg-brand-surface overflow-hidden">
                    {images[v.id] && (
                      <Image
                        src={images[v.id]}
                        alt={v.label}
                        fill
                        className="object-cover"
                      />
                    )}
                    {uploading[v.id] && (
                      <div className="absolute inset-0 bg-brand-brown/60 flex items-center justify-center">
                        <span className="text-[9px] text-white uppercase tracking-wide animate-pulse">Uploading…</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[v.id]?.click()}
                    disabled={uploading[v.id]}
                    className="flex items-center gap-1 text-[10px] text-brand-yellow hover:underline disabled:opacity-50"
                  >
                    <Upload className="h-3 w-3" />
                    {v.label}
                  </button>
                  <input
                    ref={(el) => { fileInputRefs.current[v.id] = el; }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    aria-label={`Upload image for ${v.label}`}
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(v.id, file);
                      e.target.value = "";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs uppercase tracking-widest font-medium ${published ? "text-green-600" : "text-brand-brown-light"}`}>
              {published ? "Published" : "Draft"}
            </span>
            <button
              type="button"
              onClick={() => (published ? setUnpublishModal(true) : setPublished(true))}
              aria-label="Toggle published"
              className={`relative w-12 h-6 transition-colors duration-200 ${published ? "bg-brand-yellow" : "bg-brand-surface"}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-brand-white transition-transform duration-200 ${published ? "translate-x-7" : "translate-x-1"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Editable fields */}
      <div className="bg-brand-white border-t-[3px] border-brand-yellow p-6 space-y-4">
        <h2 className="text-xs uppercase tracking-widest text-brand-brown-light">Product Details</h2>
        {[
          { label: "Product name", id: "field-name", value: name, set: setName },
          { label: "Tagline", id: "field-tagline", value: tagline, set: setTagline },
        ].map(({ label, id, value, set }) => (
          <div key={id}>
            <label htmlFor={id} className="text-xs uppercase tracking-widest text-brand-brown block mb-1">{label}</label>
            <input
              id={id}
              value={value}
              onChange={(e) => set(e.target.value)}
              className="w-full border border-brand-brown-light bg-brand-white text-brand-brown px-4 py-2.5 text-sm outline-none focus:border-brand-yellow"
            />
          </div>
        ))}
        {[
          { label: "Description", id: "field-desc", value: description, set: setDescription },
          { label: "Application", id: "field-app", value: application, set: setApplication },
          { label: "Development time", id: "field-dev", value: develop, set: setDevelop },
          { label: "Maintenance", id: "field-maint", value: maintenance, set: setMaintenance },
          { label: "Ingredients", id: "field-ingr", value: ingredients, set: setIngredients },
          { label: "Storage", id: "field-stor", value: storage, set: setStorage },
        ].map(({ label, id, value, set }) => (
          <div key={id}>
            <label htmlFor={id} className="text-xs uppercase tracking-widest text-brand-brown block mb-1">{label}</label>
            <textarea
              id={id}
              rows={3}
              value={value}
              onChange={(e) => set(e.target.value)}
              className="w-full border border-brand-brown-light bg-brand-white text-brand-brown px-4 py-2.5 text-sm outline-none focus:border-brand-yellow resize-none"
            />
          </div>
        ))}
      </div>

      {/* Variant pricing */}
      <div className="bg-brand-white border-t-[3px] border-brand-yellow p-6">
        <h2 className="text-xs uppercase tracking-widest text-brand-brown-light mb-4">Variant Pricing</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-brand-brown-light border-b border-brand-yellow">
              <th className="text-left py-2 pr-4">Variant</th>
              <th className="text-left py-2 pr-4">Price (£)</th>
              <th className="text-left py-2" aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {product.variants.map((v) => (
              <tr key={v.id} className="border-b border-brand-surface">
                <td className="py-3 pr-4 text-brand-brown">{v.label}</td>
                <td className="py-3 pr-4">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    aria-label={`Price for ${v.label}`}
                    value={prices[v.id]}
                    onChange={(e) => setPrices((prev) => ({ ...prev, [v.id]: parseFloat(e.target.value) }))}
                    className="w-24 border border-brand-brown-light bg-brand-white text-brand-brown px-3 py-1.5 text-sm outline-none focus:border-brand-yellow"
                  />
                </td>
                <td className="py-3">
                  <button
                    type="button"
                    onClick={() => handleSavePrice(v.id)}
                    disabled={priceSaving[v.id]}
                    className="text-xs text-brand-yellow hover:underline uppercase tracking-wide disabled:opacity-50"
                  >
                    {priceSaving[v.id] ? "Saving…" : priceSaved[v.id] ? "Saved ✓" : "Save"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Badges */}
      <div className="bg-brand-white border-t-[3px] border-brand-yellow p-6 space-y-4">
        <h2 className="text-xs uppercase tracking-widest text-brand-brown-light">Product Badges</h2>
        <div className="flex flex-wrap gap-2">
          {allBadges.map((badge) => (
            <button
              key={badge}
              type="button"
              onClick={() => toggleBadge(badge)}
              className={`px-4 py-2 text-xs uppercase tracking-wide border transition-colors ${
                badges.includes(badge)
                  ? "border-brand-yellow bg-brand-yellow text-brand-brown"
                  : "border-brand-brown-light text-brand-brown-mid hover:border-brand-brown"
              }`}
            >
              {badge}
            </button>
          ))}
        </div>
      </div>

      {/* SEO */}
      <div className="bg-brand-white border-t-[3px] border-brand-yellow p-6 space-y-4">
        <h2 className="text-xs uppercase tracking-widest text-brand-brown-light">SEO</h2>
        <div>
          <label htmlFor="seo-title" className="text-xs uppercase tracking-widest text-brand-brown block mb-1">
            Meta Title <span className="text-brand-brown-light">({metaTitle.length}/60)</span>
          </label>
          <input id="seo-title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} maxLength={60} className="w-full border border-brand-brown-light bg-brand-white text-brand-brown px-4 py-2.5 text-sm outline-none focus:border-brand-yellow" />
        </div>
        <div>
          <label htmlFor="seo-desc" className="text-xs uppercase tracking-widest text-brand-brown block mb-1">
            Meta Description <span className="text-brand-brown-light">({metaDesc.length}/160)</span>
          </label>
          <textarea id="seo-desc" rows={3} value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} maxLength={160} className="w-full border border-brand-brown-light bg-brand-white text-brand-brown px-4 py-2.5 text-sm outline-none focus:border-brand-yellow resize-none" />
        </div>
        <div>
          <label htmlFor="seo-slug" className="text-xs uppercase tracking-widest text-brand-brown block mb-1">URL Slug</label>
          <input id="seo-slug" readOnly value="maisonaiym.com/product/nubian-velvet" className="w-full border border-brand-brown-light bg-brand-surface text-brand-brown-light px-4 py-2.5 text-sm cursor-not-allowed" />
        </div>
      </div>

      <Button type="button" variant="primary" onClick={handleSave}>Save All Changes</Button>
      {saved && <p className="text-xs text-green-600">Changes saved.</p>}

      <ConfirmModal
        open={unpublishModal}
        onClose={() => setUnpublishModal(false)}
        onConfirm={() => { setPublished(false); setUnpublishModal(false); }}
        title="Unpublish Product"
        description="This will hide Nubian Velvet from the storefront. Customers will not be able to purchase it."
        confirmLabel="Unpublish"
        destructive
      />
    </div>
  );
}
