"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ugcItems = [
  { src: "/images/Picture-2.png",  username: "@nubianvelvet",  handle: "Amara K." },
  { src: "/images/Picture-11.png", username: "@glowwithaiym",  handle: "Zara O." },
  { src: "/images/Picture-12.jpg", username: "@melanintan",    handle: "Imani T." },
  { src: "/images/Picture-20.png", username: "@aiymofficial",  handle: "Sade B." },
  { src: "/images/Picture-9.jpg",  username: "@maisonaiym",    handle: "Kezia M." },
];

export default function UGCGrid() {
  return (
    <section className="bg-brand-cream">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-brand-yellow mb-3">Community Glow</p>
          <h2 className="font-display text-4xl md:text-5xl text-brand-brown uppercase tracking-widest">
            Loved by Thousands
          </h2>
        </motion.div>
        <div className="flex justify-center mb-12">
          <div className="w-14 h-px bg-brand-yellow" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {ugcItems.map((item, i) => (
            <motion.div
              key={i}
              className="group flex flex-col items-center gap-2"
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="relative aspect-square w-full overflow-hidden border-2 border-transparent group-hover:border-brand-yellow transition-all duration-300">
                <Image
                  src={item.src}
                  alt={item.handle}
                  fill
                  className="object-cover group-hover:scale-[1.08] transition-transform duration-500"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-brand-brown/0 group-hover:bg-brand-brown/30 transition-colors duration-300 flex items-end p-3">
                  <span className="text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.username}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-brand-brown-light">{item.handle}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Brand strip */}
      <div className="bg-brand-brown border-t border-brand-yellow py-8 px-6 text-center">
        <p className="font-display italic text-xl md:text-2xl text-white/90 tracking-wide mb-1">
          Crafted for melanin. Built for glow.
        </p>
        <p className="text-[10px] uppercase tracking-[0.3em] text-brand-yellow/80">— Maison AIYM</p>
      </div>
    </section>
  );
}
