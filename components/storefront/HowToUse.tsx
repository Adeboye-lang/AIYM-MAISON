"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    num: "01",
    title: "Prepare Your Skin",
    body: "Exfoliate and moisturise 24 hours before application. Pay extra attention to knees, elbows, and ankles.",
    image: "/images/Picture 4.png",
    alt: "Model with glowing skin preparation",
    // Landscape image — contain so both Application & After 3H panels show fully
    fit: "object-contain",
    bg: "bg-brand-cream",
  },
  {
    num: "02",
    title: "Apply with Your Mitt",
    body: "Use the AIYM velvet mitt in long, circular motions for an even, seamless finish. Apply any residue to hands, feet, and joints.",
    image: "/images/Product 4.png",
    alt: "AIYM velvet application mitt and product",
    fit: "object-cover object-center",
    bg: "",
  },
  {
    num: "03",
    title: "Let It Develop",
    body: "Leave for a minimum of 2–4 hours. For a deeper, richer finish, leave overnight. Rinse lightly with warm water to reveal your glow.",
    image: "/images/Picture 5.png",
    alt: "Model revealing golden glow",
    fit: "object-cover object-top",
    bg: "",
  },
];

export default function HowToUse() {
  return (
    <section id="how-to-use" className="bg-brand-surface">
      <div className="h-px bg-brand-yellow w-full" />
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-brand-yellow mb-3">The Ritual</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-brown uppercase tracking-widest mb-3">
            How To Use
          </h2>
          <p className="text-brand-brown-light text-sm tracking-wide">Three simple steps to your perfect glow.</p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.18, duration: 0.6 }}
            >
              {/* Image */}
              <div className={`relative aspect-[3/4] overflow-hidden group ${step.bg}`}>
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  className={`${step.fit} group-hover:scale-105 transition-transform duration-700`}
                />
                {/* Step number overlay */}
                <div className="absolute top-4 left-4 w-9 h-9 bg-brand-yellow flex items-center justify-center">
                  <span className="font-display text-brand-brown font-bold text-sm">{step.num}</span>
                </div>
              </div>

              {/* Text */}
              <div>
                <h3 className="font-display text-2xl text-brand-brown mb-2">{step.title}</h3>
                <div className="w-7 h-px bg-brand-yellow mb-3" />
                <p className="text-brand-brown-mid text-sm leading-relaxed">{step.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer callout */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <p className="font-display italic text-2xl text-brand-brown-light">
            &ldquo;Your skin, elevated.&rdquo;
          </p>
        </motion.div>
      </div>
      <div className="h-px bg-brand-yellow w-full" />
    </section>
  );
}
