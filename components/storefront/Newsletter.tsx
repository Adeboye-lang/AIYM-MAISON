"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function Newsletter() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="relative bg-brand-brown overflow-hidden border-t-2 border-brand-yellow">
      {/* Decorative gold circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-5 bg-brand-yellow pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-5 bg-brand-yellow pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 md:px-6 py-14 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-10 h-px bg-brand-yellow/50" />
            <p className="text-[11px] uppercase tracking-[0.3em] text-brand-yellow">The Inner Circle</p>
            <div className="w-10 h-px bg-brand-yellow/50" />
          </div>

          {submitted ? (
            <div className="py-8">
              <p className="font-display text-4xl md:text-5xl text-brand-yellow mb-3">
                You&apos;re In ✓
              </p>
              <p className="text-white/60 text-sm tracking-wide">Welcome to the Inner Circle. Expect something beautiful soon.</p>
            </div>
          ) : (
            <>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-widest mb-4">
                Join The Inner Circle
              </h2>
              <p className="text-white/65 text-sm mb-10 tracking-wide leading-relaxed max-w-md mx-auto">
                Be first for new drops, exclusive early access, and once-in-a-season offers.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-brand-white"
                  />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-brand-white"
                  />
                </div>
                <Button type="submit" variant="accent" loading={loading} fullWidth>
                  Join Now — It&apos;s Free
                </Button>
              </form>

              <p className="text-white/30 text-[10px] mt-5">
                No spam, ever. Unsubscribe at any time.
              </p>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
