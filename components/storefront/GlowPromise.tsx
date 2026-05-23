import { Droplets, Leaf, Clock, ShieldCheck } from "lucide-react";

const promises = [
  {
    icon: Droplets,
    title: "Hyaluronic Acid Infused",
    body: "Every application delivers deep hydration, leaving skin feeling soft, plump, and nourished — never dry or tight.",
  },
  {
    icon: Leaf,
    title: "100% Vegan & Cruelty-Free",
    body: "No animal-derived ingredients. No animal testing. Ever. Beauty that feels good inside and out.",
  },
  {
    icon: Clock,
    title: "Develops in 2–8 Hours",
    body: "Control your depth. A quick rinse reveals a natural golden warmth tailored to your melanin.",
  },
  {
    icon: ShieldCheck,
    title: "Zero Ash. Zero Streak.",
    body: "Engineered specifically for deep skin tones. No grey undertones, no patchiness — just radiant, even colour.",
  },
];

export default function GlowPromise() {
  return (
    <section className="bg-brand-cream py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[11px] uppercase tracking-[0.3em] text-brand-yellow mb-3">Our Commitment</p>
          <h2 className="font-display text-3xl md:text-5xl text-brand-brown uppercase tracking-widest">
            The Glow Promise
          </h2>
          <div className="h-px bg-brand-yellow w-16 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {promises.map((p) => (
            <div key={p.title} className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 flex items-center justify-center border border-brand-yellow">
                <p.icon className="h-6 w-6 text-brand-yellow" />
              </div>
              <h3 className="font-display text-lg text-brand-brown uppercase tracking-wide">{p.title}</h3>
              <p className="text-brand-brown-light text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 md:mt-20 border-t border-brand-yellow/30 pt-12 text-center max-w-2xl mx-auto">
          <p className="font-display italic text-xl md:text-2xl text-brand-brown leading-relaxed">
            &ldquo;Nubian Velvet was born from a gap in the market — a self-tan that truly celebrates deep skin. Not an afterthought. The whole point.&rdquo;
          </p>
          <p className="mt-4 text-[11px] uppercase tracking-widest text-brand-yellow">— Founder, Maison AIYM</p>
        </div>
      </div>
    </section>
  );
}
