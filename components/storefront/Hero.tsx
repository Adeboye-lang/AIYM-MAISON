"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative w-full h-screen flex items-center justify-center overflow-hidden">

      {/* Parallax background */}
      <motion.div className="absolute inset-0 scale-110" style={{ y }}>
        <Image
          src="/images/Picture 1.png"
          alt="Model showcasing AIYM Nubian Velvet glow"
          fill
          className="object-cover object-top"
          priority
        />
      </motion.div>

      {/* Rich layered overlay — depth + luxury vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-brown/75 via-brand-brown/20 to-brand-brown/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-brown/55 via-transparent to-brand-brown/55" />

      {/* Vertical gold accent lines — editorial */}
      <motion.div
        className="absolute left-8 md:left-16 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-brand-yellow to-transparent"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 0.6 }}
        transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
      />
      <motion.div
        className="absolute right-8 md:right-16 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-brand-yellow to-transparent"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 0.6 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
      />

      {/* Top gold bar */}
      <motion.div
        className="absolute top-24 left-8 md:left-16 right-8 md:right-16 h-px bg-gradient-to-r from-transparent via-brand-yellow/50 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      />

      {/* Floating gold orb */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(201,168,76,0.14) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div id="hero-sentinel" className="absolute bottom-0 left-0 w-px h-px" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl"
        style={{ opacity }}
      >
        {/* Eyebrow label */}
        <motion.div
          className="flex items-center gap-4 mb-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="w-10 h-px bg-brand-yellow" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-brand-yellow">Maison AIYM · Nubian Velvet</p>
          <div className="w-10 h-px bg-brand-yellow" />
        </motion.div>

        {/* Main heading — two lines, AIYM in gold */}
        <motion.h1
          className="font-display text-[2.8rem] sm:text-[4rem] md:text-[6rem] lg:text-[9rem] text-white uppercase leading-[0.88] mb-6 tracking-[0.05em]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
        >
          Maison<br />
          <span className="text-brand-yellow drop-shadow-[0_0_40px_rgba(201,168,76,0.5)]">AIYM</span>
        </motion.h1>

        {/* Gold divider */}
        <motion.div
          className="flex items-center gap-4 mb-7"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="w-16 h-px bg-brand-yellow/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
          <div className="w-16 h-px bg-brand-yellow/60" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-white/85 text-base md:text-xl tracking-[0.15em] max-w-xs font-light italic font-display mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Your glow perfected
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
        >
          <Link
            href="#product"
            className="inline-flex items-center justify-center uppercase tracking-[0.25em] text-xs font-medium px-12 py-4 bg-brand-yellow text-brand-brown hover:bg-brand-yellow-light transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]"
          >
            Shop Now
          </Link>
          <Link
            href="#how-to-use"
            className="inline-flex items-center justify-center uppercase tracking-[0.25em] text-xs font-medium px-12 py-4 border border-white/50 text-white hover:border-brand-yellow hover:text-brand-yellow transition-all duration-300 backdrop-blur-sm"
          >
            How To Use
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom gold bar */}
      <motion.div
        className="absolute bottom-20 left-8 md:left-16 right-8 md:right-16 h-px bg-gradient-to-r from-transparent via-brand-yellow/35 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      />

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <span className="text-[9px] uppercase tracking-[0.35em]">Discover</span>
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
