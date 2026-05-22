"use client";

import { useState } from "react";
import { X } from "lucide-react";

const messages = [
  "FREE UK SHIPPING ON ORDERS OVER £40",
  "NEW DROP — NUBIAN VELVET IS HERE",
  "RATED 4.9 ★ BY OVER 1,000 GLOWING CUSTOMERS",
];

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [idx, setIdx] = useState(0);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-brand-yellow text-brand-brown h-10 flex items-center justify-between px-4">
      <div className="flex-1 flex items-center justify-center gap-6 overflow-hidden">
        <button
          type="button"
          title="Previous"
          onClick={() => setIdx((idx - 1 + messages.length) % messages.length)}
          className="text-brand-brown/60 hover:text-brand-brown transition-colors text-xs hidden sm:block"
          aria-label="Previous message"
        >
          ‹
        </button>
        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-medium text-center truncate px-2">
          {messages[idx]}
        </p>
        <button
          type="button"
          title="Next"
          onClick={() => setIdx((idx + 1) % messages.length)}
          className="text-brand-brown/60 hover:text-brand-brown transition-colors text-xs hidden sm:block"
          aria-label="Next message"
        >
          ›
        </button>
      </div>
      <button
        type="button"
        title="Dismiss"
        onClick={() => setVisible(false)}
        className="ml-3 text-brand-brown/60 hover:text-brand-brown transition-colors flex-shrink-0"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
