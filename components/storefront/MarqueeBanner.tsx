export default function MarqueeBanner() {
  const items = [
    "Vegan Formula",
    "✦",
    "Cruelty Free",
    "✦",
    "Melanin-First",
    "✦",
    "No Streak Guarantee",
    "✦",
    "Hyaluronic Acid Enriched",
    "✦",
    "Dermatologist Tested",
    "✦",
    "Natural Coconut Scent",
    "✦",
    "As Seen In Vogue",
    "✦",
    "Vegan Formula",
    "✦",
    "Cruelty Free",
    "✦",
    "Melanin-First",
    "✦",
    "No Streak Guarantee",
    "✦",
    "Hyaluronic Acid Enriched",
    "✦",
    "Dermatologist Tested",
    "✦",
    "Natural Coconut Scent",
    "✦",
    "As Seen In Vogue",
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
