"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("aiym_cookie_consent")) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("aiym_cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("aiym_cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-brand-brown border-t border-brand-yellow px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <p className="text-white/80 text-xs leading-relaxed max-w-2xl">
          We use cookies to enhance your experience, analyse site traffic, and personalise content.
          By clicking &ldquo;Accept&rdquo; you consent to our use of cookies.{" "}
          <Link href="/privacy" className="text-brand-yellow hover:underline">Learn more</Link>
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={decline}
            className="text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors px-4 py-2 border border-white/20 hover:border-white/40"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={accept}
            className="text-xs uppercase tracking-widest bg-brand-yellow text-brand-brown px-6 py-2 hover:bg-brand-yellow-light transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
