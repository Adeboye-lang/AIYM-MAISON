"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "./CartDrawer";
import { product } from "@/lib/constants";

export default function OfferBanner() {
  const { addItem } = useCart();
  const foam = product.variants[0];
  const bundle = product.variants[1];

  return (
    <section className="bg-brand-brown border-t-2 border-brand-yellow">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2">

        {/* Text */}
        <motion.div
          className="flex flex-col justify-center p-6 md:p-12 lg:p-16 gap-5 md:gap-6"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-brand-yellow" />
              <p className="text-[11px] uppercase tracking-[0.3em] text-brand-yellow">Exclusive Offer</p>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white uppercase leading-tight mb-3 md:mb-4">
              The AIYM<br />Bundle
            </h2>
            <p className="text-white/75 text-sm leading-relaxed mb-2">
              Get the full experience. Nubian Velvet tanning foam with the AIYM velvet application
              mitt — for just £28.00. Or grab the foam alone for £26.00.
            </p>
            <p className="text-brand-yellow-light text-[11px] tracking-wide">
              Free UK delivery on orders over £40 · No code needed.
            </p>
          </div>

          <div className="w-10 h-px bg-brand-yellow" />

          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              type="button"
              onClick={() => addItem(bundle.id, bundle.label, bundle.price)}
              className="inline-flex items-center justify-center uppercase tracking-[0.15em] text-[11px] font-medium px-6 py-4 bg-brand-yellow text-brand-brown hover:bg-brand-yellow-light transition-colors"
              whileTap={{ scale: 0.97 }}
            >
              Shop The Bundle — £28.00
            </motion.button>
            <motion.button
              type="button"
              onClick={() => addItem(foam.id, foam.label, foam.price)}
              className="inline-flex items-center justify-center uppercase tracking-[0.15em] text-[11px] font-medium px-6 py-4 border border-white/40 text-white hover:border-brand-yellow hover:text-brand-yellow transition-colors"
              whileTap={{ scale: 0.97 }}
            >
              Foam Only — £26.00
            </motion.button>
          </div>
        </motion.div>

        {/* Mittens + foam image */}
        <div className="relative min-h-[260px] md:min-h-[420px]">
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px bg-brand-yellow z-10" />
          <Image
            src="/images/Mittens.png"
            alt="AIYM velvet mitt and tanning foam bundle"
            fill
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
