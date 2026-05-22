"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

export default function PreferencesPage() {
  const [marketing, setMarketing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/account/preferences")
      .then((r) => r.ok ? r.json() : { marketing: false })
      .then((d) => setMarketing(d.marketing ?? false))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/account/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketing }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-4xl text-brand-brown uppercase mb-2">My Preferences</h1>
        <div className="h-px bg-brand-yellow w-full" />
      </div>

      <section className="bg-brand-white p-6 border-t-[3px] border-brand-yellow space-y-4">
        <h2 className="text-xs uppercase tracking-widest text-brand-brown font-medium">
          Marketing Preferences
        </h2>

        {loading ? (
          <p className="text-sm text-brand-brown-light">Loading...</p>
        ) : (
          <>
            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <span className="text-sm text-brand-brown-mid">
                Receive exclusive offers and updates from AIYM
              </span>
              <div
                onClick={() => setMarketing(!marketing)}
                className={`relative w-12 h-6 flex-shrink-0 transition-colors duration-200 cursor-pointer ${
                  marketing ? "bg-brand-yellow" : "bg-brand-surface"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-brand-white transition-transform duration-200 ${
                    marketing ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </div>
            </label>

            <label className="flex items-center justify-between gap-4">
              <span className="text-sm text-brand-brown-mid">
                Order dispatch and delivery notifications
              </span>
              <div className="relative w-12 h-6 flex-shrink-0 bg-brand-yellow opacity-60 cursor-not-allowed">
                <div className="absolute top-1 right-1 w-4 h-4 bg-brand-white" />
              </div>
            </label>
            <p className="text-xs text-brand-brown-light">Order notifications cannot be disabled.</p>

            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Preferences"}
            </Button>
            {saved && <p className="text-xs text-green-600">Preferences saved.</p>}
          </>
        )}
      </section>

      <section className="bg-brand-white p-6 border-t-[3px] border-brand-yellow space-y-2">
        <h2 className="text-xs uppercase tracking-widest text-brand-brown font-medium mb-3">Display</h2>
        <div className="flex items-center justify-between">
          <span className="text-sm text-brand-brown-mid">Preferred currency</span>
          <span className="text-sm text-brand-brown font-medium">GBP £</span>
        </div>
        <p className="text-xs text-brand-brown-light">Currency cannot be changed.</p>
      </section>
    </div>
  );
}
