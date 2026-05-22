"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function UnsubscribeContent() {
  const params = useSearchParams();
  const success = params.get("success") === "1";
  const error = params.get("error");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(success);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(error ? "This unsubscribe link is invalid or has already been used." : "");

  useEffect(() => { if (success) setDone(true); }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setDone(true);
      else setErr("Email address not found in our list.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-cream flex items-center justify-center px-6">
      <div className="text-center max-w-md w-full">
        <p className="text-[11px] uppercase tracking-[0.3em] text-brand-yellow mb-4">Newsletter</p>
        <h1 className="font-display text-4xl md:text-5xl text-brand-brown uppercase tracking-widest mb-4">
          Unsubscribe
        </h1>
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-12 h-px bg-brand-yellow/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
          <div className="w-12 h-px bg-brand-yellow/60" />
        </div>

        {done ? (
          <div className="space-y-4">
            <p className="text-brand-brown-mid text-sm">You have been successfully unsubscribed from AIYM marketing emails.</p>
            <Link href="/" className="inline-flex items-center justify-center uppercase tracking-[0.25em] text-xs font-medium px-10 py-4 bg-brand-yellow text-brand-brown hover:bg-brand-yellow-light transition-all duration-300">
              Return Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <p className="text-brand-brown-mid text-sm text-center mb-6">
              Enter your email address to unsubscribe from AIYM marketing emails.
            </p>
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-brand-brown-light bg-brand-white text-brand-brown px-4 py-3 text-sm outline-none focus:border-brand-yellow"
            />
            {err && <p className="text-xs text-red-600">{err}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full uppercase tracking-[0.25em] text-xs font-medium px-10 py-4 bg-brand-yellow text-brand-brown hover:bg-brand-yellow-light transition-all duration-300 disabled:opacity-60"
            >
              {loading ? "Processing..." : "Unsubscribe"}
            </button>
            <div className="text-center">
              <Link href="/" className="text-xs text-brand-brown-light hover:text-brand-yellow">Return home</Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-cream" />}>
      <UnsubscribeContent />
    </Suspense>
  );
}
