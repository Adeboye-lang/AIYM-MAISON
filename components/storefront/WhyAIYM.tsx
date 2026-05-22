"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const pillars = [
  {
    icon: "✦",
    title: "Melanin-First Formula",
    body: "Created specifically for deep, melanin-rich skin tones — no orange, no ash, just a natural golden warmth.",
  },
  {
    icon: "◎",
    title: "Hyaluronic Acid Enriched",
    body: "Every application leaves your skin feeling plump, hydrated, and supple — not dry and cracked like other tanners.",
  },
  {
    icon: "❋",
    title: "Zero Streak Guarantee",
    body: "The velvety mousse formula glides on evenly and blends seamlessly so every finish is flawless.",
  },
  {
    icon: "♡",
    title: "Vegan & Cruelty-Free",
    body: "100% vegan ingredients. Never tested on animals. Good for your skin and the planet.",
  },
];

export default function WhyAIYM() {
  return (
    <section className="bg-brand-cream">
      <div className="h-px bg-brand-yellow w-full" />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 grid lg:grid-cols-2 gap-8 md:gap-16 items-center">

        {/* Left — image */}
        <motion.div
          className="relative overflow-hidden"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Image — shown at its natural 5:4 landscape ratio so nothing is cut off */}
          <div className="relative w-full pb-[80.9%]">
            <Image
              src="/images/Product-5.png"
              alt="Nubian Velvet tanning foam product"
              fill
              className="object-cover object-center"
            />
            {/* Decorative frame */}
            <div className="absolute inset-4 border border-brand-yellow pointer-events-none" />
            {/* Stat badge */}
            <div className="absolute bottom-6 left-6 bg-brand-brown/90 backdrop-blur-sm px-5 py-3">
              <p className="font-display text-brand-yellow text-2xl">4.9 ★</p>
              <p className="text-white/70 text-[10px] uppercase tracking-widest">Over 1,000 happy customers</p>
            </div>
          </div>
        </motion.div>

        {/* Right — pillars */}
        <div>
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-brand-yellow mb-3">Why AIYM</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-brown uppercase tracking-widest leading-tight">
              Crafted for<br />
              <em className="text-brand-yellow not-italic">Melanin.</em>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
              >
                <span className="text-brand-yellow text-xl">{p.icon}</span>
                <h3 className="font-display text-xl text-brand-brown">{p.title}</h3>
                <div className="w-6 h-px bg-brand-yellow" />
                <p className="text-brand-brown-mid text-sm leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-px bg-brand-yellow w-full" />
    </section>
  );
}
