export default function MarqueeBanner() {
  const items = [
    "Formulated for Melanin-Rich Skin",
    "✦",
    "Zero Ash · Zero Streak",
    "✦",
    "Hyaluronic Acid Infused",
    "✦",
    "Develops in 2–8 Hours",
    "✦",
    "Coconut-Scented Mousse",
    "✦",
    "Vegan & Cruelty-Free",
    "✦",
    "Dermatologist Approved",
    "✦",
    "Free UK Shipping Over £40",
    "✦",
    "Formulated for Melanin-Rich Skin",
    "✦",
    "Zero Ash · Zero Streak",
    "✦",
    "Hyaluronic Acid Infused",
    "✦",
    "Develops in 2–8 Hours",
    "✦",
    "Coconut-Scented Mousse",
    "✦",
    "Vegan & Cruelty-Free",
    "✦",
    "Dermatologist Approved",
    "✦",
    "Free UK Shipping Over £40",
    "✦",
  ];

  return (
    <div className="bg-brand-brown overflow-hidden py-3 border-y border-brand-yellow">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((item, i) => (
          <span
            key={i}
            className={`inline-block px-5 text-[11px] uppercase tracking-[0.25em] ${
              item === "✦" ? "text-brand-yellow" : "text-white/80"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
