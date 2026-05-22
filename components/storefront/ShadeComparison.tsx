"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function BeforeAfterSlider() {
  const [pct, setPct] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPct((x / rect.width) * 100);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[3/4] overflow-hidden cursor-col-resize select-none"
      onMouseDown={() => (dragging.current = true)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onMouseMove={(e) => dragging.current && handleMove(e.clientX)}
      onTouchStart={(e) => { dragging.current = true; handleMove(e.touches[0].clientX); }}
      onTouchEnd={() => (dragging.current = false)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      {/* After */}
      <Image src="/images/Picture 8.png" alt="8 hours tan result" fill className="object-cover" draggable={false} />
      {/* Before — clipped */}
      <div
        className="shade-clip-panel absolute inset-0 overflow-hidden"
        style={{ "--shade-clip": `${100 - pct}%` } as React.CSSProperties}
      >
        <Image src="/images/Picture 6.jpg" alt="Before tan" fill className="object-cover" draggable={false} />
      </div>
      {/* Labels */}
      <div className="absolute top-3 left-3 bg-brand-brown/70 text-white text-[9px] uppercase tracking-widest px-2 py-1">Before</div>
      <div className="absolute top-3 right-3 bg-brand-yellow text-brand-brown text-[9px] uppercase tracking-widest px-2 py-1">After</div>
      {/* Drag handle */}
      <div
        className="shade-handle absolute top-0 bottom-0 w-px bg-brand-yellow pointer-events-none"
        style={{ "--shade-pos": `${pct}%` } as React.CSSProperties}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg text-brand-brown text-xs font-bold select-none">
          ◁▷
        </div>
      </div>
    </div>
  );
}

const shades = [
  { label: "4 Hours", src: "/images/Picture 5.png", alt: "4 hour tan result" },
  { label: "Overnight", src: "/images/Picture 9.jpg", alt: "Overnight tan result" },
];

export default function ShadeComparison() {
  return (
    <section className="bg-brand-white">
      <div className="h-px bg-brand-yellow w-full" />
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">

        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-brand-yellow mb-3">See The Difference</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-brown uppercase tracking-widest mb-3">
            Meet Your Shade
          </h2>
          <p className="text-brand-brown-light text-sm">
            See Nubian Velvet develop at 4 hours, 8 hours, and overnight.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-end">
          {/* 4 hours */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0, duration: 0.6 }}
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden group">
              <Image src={shades[0].src} alt={shades[0].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-brand-brown">{shades[0].label}</p>
          </motion.div>

          {/* 8 hours drag slider */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <BeforeAfterSlider />
            <p className="text-[11px] uppercase tracking-[0.2em] text-brand-brown">8 Hours — Drag to Compare</p>
          </motion.div>

          {/* Overnight */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden group">
              <Image src={shades[1].src} alt={shades[1].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-brand-brown">{shades[1].label}</p>
          </motion.div>
        </div>

        <motion.p
          className="text-center font-display italic text-brand-brown-light text-xl mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          No streaks. No odour. Just you, elevated.
        </motion.p>
      </div>
      <div className="h-px bg-brand-yellow w-full" />
    </section>
  );
}
