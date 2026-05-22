"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function TanStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="story" ref={ref} className="relative overflow-hidden min-h-[80vh] flex items-center">
      {/* Parallax background image */}
      <motion.div className="absolute inset-0 scale-110" style={{ y }}>
        <Image
          src="/images/Picture-3.png"
          alt="Model showcasing Nubian Velvet tan"
          fill
          className="object-cover object-center"
        />
      </motion.div>

      {/* Rich overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-brown/80 via-brand-brown/55 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-28 lg:py-40 w-full">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-brand-yellow" />
              <p className="text-[11px] uppercase tracking-[0.3em] text-brand-yellow">The AIYM Story</p>
            </div>

            <h2 className="font-display text-4xl md:text-5xl lg:text-7xl text-white uppercase leading-[0.9] mb-6 md:mb-8">
              Every.<br />
              Body.<br />
              <em className="text-brand-yellow not-italic">Radiant.</em>
            </h2>

            <p className="text-white/80 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
              Nubian Velvet was created for skin that deserves to be celebrated — not changed.
              A formula enriched with hyaluronic acid, designed to melt into melanin-rich
              complexions with a warm, golden radiance.
            </p>

            <Link
              href="#product"
              className="inline-flex items-center gap-3 uppercase tracking-[0.2em] text-xs font-medium px-8 py-4 bg-brand-yellow text-brand-brown hover:bg-brand-yellow-light transition-all duration-300 hover:gap-5"
            >
              Meet Nubian Velvet
              <span>→</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Floating stat cards */}
      <motion.div
        className="absolute bottom-10 right-8 hidden lg:flex flex-col gap-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        {[
          { value: "4.9★", label: "Average Rating" },
          { value: "1,000+", label: "Happy Customers" },
          { value: "0%", label: "Streak Formula" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/10 backdrop-blur-sm border border-brand-yellow/30 px-5 py-3 text-right">
            <p className="font-display text-xl text-brand-yellow">{stat.value}</p>
            <p className="text-white/60 text-[10px] uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
