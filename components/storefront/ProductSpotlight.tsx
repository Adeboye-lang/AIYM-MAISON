"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Truck } from "lucide-react";
import { product } from "@/lib/constants";
import { useCart } from "./CartDrawer";
import { AccordionItem } from "@/components/ui/Accordion";

const gallery = [
  { src: "/images/Main-Product.jpg", alt: "Nubian Velvet tanning mousse" },
  { src: "/images/Product-1.jpg", alt: "Product detail" },
  { src: "/images/Product-2.jpg", alt: "Product lifestyle" },
  { src: "/images/Product-3.jpg", alt: "Product texture" },
  { src: "/images/New-Mittens.png", alt: "AIYM mitt and foam bundle" },
];

// Main image index per variant id
const VARIANT_GALLERY_INDEX: Record<string, number> = {
  "foam-only": 0,
  "foam-with-mitts": 4,
};

type Variant = (typeof product.variants)[number] & { priceDisplay: string };

function formatGBP(n: number) {
  return `£${n.toFixed(2)}`;
}

export default function ProductSpotlight() {
  const [variants, setVariants] = useState<Variant[]>(product.variants as Variant[]);
  const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[1] as Variant);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(VARIANT_GALLERY_INDEX["foam-with-mitts"]);
  const { addItem } = useCart();

  // Overlay DB prices onto constants variants
  useEffect(() => {
    fetch("/api/product")
      .then((r) => r.json())
      .then((d) => {
        if (!d.variants?.length) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const priceMap: Record<string, number> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        d.variants.forEach((v: any) => { if (v.variantKey) priceMap[v.variantKey] = v.price; });
        setVariants((prev) =>
          prev.map((v) =>
            priceMap[v.id] !== undefined
              ? { ...v, price: priceMap[v.id], priceDisplay: formatGBP(priceMap[v.id]) }
              : v
          )
        );
      })
      .catch(() => {});
  }, []);

  const handleAddToBag = () => {
    addItem(selectedVariant.id, selectedVariant.label, selectedVariant.price);
    setQty(1);
  };

  return (
    <section id="product" className="bg-brand-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2">

        {/* Image gallery panel — landscape layout, hidden on mobile */}
        <div className="hidden md:flex flex-col bg-brand-surface self-stretch">
          {/* Main image — fills all available height */}
          <div className="relative flex-1 overflow-hidden min-h-[400px]">
            <div className="absolute inset-4 border border-brand-yellow z-10 pointer-events-none" />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImg}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src={gallery[activeImg].src}
                  alt={gallery[activeImg].alt}
                  fill
                  className="object-contain object-center bg-brand-surface"
                  priority={activeImg === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Horizontal thumbnails pinned at bottom */}
          <div className="flex flex-row gap-2 p-3 border-t border-brand-yellow/20 overflow-x-auto flex-shrink-0">
            {gallery.map((img, i) => (
              <button
                key={i}
                type="button"
                title={img.alt}
                onClick={() => setActiveImg(i)}
                className={`relative aspect-square flex-shrink-0 w-14 overflow-hidden border-2 transition-all duration-200 ${
                  activeImg === i ? "border-brand-yellow" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img.src} alt={img.alt} fill className="object-contain bg-brand-surface p-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Details panel */}
        <motion.div
          className="flex flex-col justify-center p-5 md:p-8 lg:p-12 gap-4 md:gap-5"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-brand-yellow mb-1">Maison AIYM</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-brand-brown uppercase mb-1">Nubian Velvet</h2>
            <p className="text-brand-brown-light italic text-sm font-display">{product.tagline}</p>
          </div>

          <div className="h-px bg-brand-yellow w-full" />

          <p className="text-brand-brown-mid text-sm leading-relaxed">{product.description}</p>

          {/* Variant selector */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-brand-brown mb-3">Choose Your Kit</p>
            {/* Mobile-only: active variant image preview */}
            <div className="md:hidden relative w-full h-48 mb-3 overflow-hidden bg-brand-surface">
              <Image
                src={gallery[activeImg].src}
                alt={gallery[activeImg].alt}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {variants.map((v) => {
                const isSelected = selectedVariant.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setSelectedVariant(v as Variant);
                      const idx = VARIANT_GALLERY_INDEX[v.id];
                      if (idx !== undefined) setActiveImg(idx);
                    }}
                    className={`relative text-left p-4 border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-brand-yellow bg-brand-yellow/10"
                        : "border-brand-brown-light/40 bg-brand-surface hover:border-brand-yellow/50"
                    }`}
                  >
                    {v.badge && (
                      <span className="absolute -top-2.5 right-2 bg-brand-yellow text-brand-brown text-[9px] font-bold uppercase tracking-wide px-2 py-0.5">
                        {v.badge}
                      </span>
                    )}
                    {isSelected && <Check className="absolute top-3 right-3 h-3.5 w-3.5 text-brand-yellow" />}
                    <p className="text-[11px] font-medium text-brand-brown uppercase tracking-wide">{v.label}</p>
                    <p className="text-brand-yellow font-display text-xl">{v.priceDisplay}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity + price */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-brand-brown-light/40">
              <button type="button" title="Decrease" className="px-3 py-2 text-brand-brown hover:bg-brand-surface transition-colors text-sm" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span className="px-5 text-brand-brown text-sm">{qty}</span>
              <button type="button" title="Increase" className="px-3 py-2 text-brand-brown hover:bg-brand-surface transition-colors text-sm" onClick={() => setQty(Math.min(10, qty + 1))}>+</button>
            </div>
            <span className="font-display text-2xl text-brand-brown">{selectedVariant.priceDisplay}</span>
          </div>

          {/* Pre-order button */}
          <motion.button
            type="button"
            onClick={handleAddToBag}
            className="w-full bg-brand-brown text-white uppercase tracking-[0.2em] text-xs py-4 hover:bg-brand-brown-mid transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            Pre-Order Now
          </motion.button>

          {/* Delivery note */}
          <div className="flex items-center gap-2 text-xs text-brand-brown-light">
            <Truck className="h-4 w-4" />
            <span>Free UK delivery on orders over £40</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {product.badges.map((badge) => (
              <span key={badge} className="px-3 py-1 text-[10px] uppercase tracking-wide bg-brand-surface text-brand-brown-mid border border-brand-brown-light/20">
                {badge}
              </span>
            ))}
          </div>

          <div className="h-px bg-brand-yellow w-full" />

          {/* Accordions */}
          <div>
            <AccordionItem question="Ingredients" answer={product.ingredients} />
            <AccordionItem question="How to Apply" answer={product.application} />
            <AccordionItem question="Development Time" answer={product.develop} />
            <AccordionItem question="Storage & Shelf Life" answer={product.storage} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
