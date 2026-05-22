export const product = {
  name: "Nubian Velvet",
  brand: "AIYM",
  tagline: "Radiance, Perfected.",
  description:
    "Nubian Velvet is a rich-toned tanning mousse designed to enhance and celebrate deep, melanin-rich skin with a radiant, golden undertone. This shade melts into your complexion like velvet — smooth, warm, and full of power. Quick drying and non-sticky.",
  shade: "Deep with warm undertone",
  application:
    "Exfoliate before tanning. Apply foam with the AIYM mitts using long circular motions. Use residue on hands, feet, elbows and knees. Allow to dry for 60 seconds before dressing.",
  develop:
    "Minimum 2–4 hours. Leave overnight for an even deeper, richer finish. Rinse lightly with warm water to reveal your glow.",
  maintenance: "Keep moisturised daily to extend and maintain your tan.",
  storage:
    "Store in a cool, dry place away from direct sunlight and high temperatures for up to 12 months.",
  ingredients:
    "Aqua, Dihydroxyacetone, Glycerin, Propylene Glycol, Cocamidopropyl Betaine, Polysorbate 20, Phenoxyethanol, Ethylhexylglycerin, Aloe Barbadensis Leaf Extract, Camellia Sinensis Leaf Extract, Parfum, Sodium Metabisulphite, CI 19140, CI 42090, CI 16035, CI 61570.",
  badges: ["Fragrance Friendly", "Vegan", "Cruelty Free", "Quick Drying"],
  variants: [
    {
      id: "foam-only",
      label: "Tanning Foam",
      description: "Nubian Velvet tanning foam — no mitt included.",
      price: 26.0,
      priceDisplay: "£26.00",
      inStock: true,
      image: "/images/Main-Product.jpg",
    },
    {
      id: "foam-with-mitts",
      label: "Tanning Foam + Mitts",
      description:
        "Nubian Velvet tanning foam bundled with the AIYM velvet application mitt.",
      price: 28.0,
      priceDisplay: "£28.00",
      inStock: true,
      badge: "BEST VALUE",
      image: "/images/Mittens.png",
    },
  ],
};

export const faqs = [
  {
    q: "How do I apply Nubian Velvet for the best results?",
    a: "Exfoliate and moisturise your skin 24 hours before applying. Use the AIYM velvet mitt in long circular motions, starting from your legs and working upward. Avoid water for 6–8 hours after application. For the best results, leave it overnight.",
  },
  {
    q: "How long does the tan last?",
    a: "Your tan can last between 7–10 days depending on your skin type. Moisturise daily to prolong the colour.",
  },
  {
    q: "What is the shelf life of the product?",
    a: "The shelf life is 12 months. Store in a cool, dry place away from direct sunlight and high temperatures.",
  },
  {
    q: "Will Nubian Velvet stain my clothes or bed sheets?",
    a: "Our formula is designed to dry quickly and be non-sticky, minimising the risk of transfer. We recommend wearing loose, dark clothing immediately after application while the tan develops.",
  },
  {
    q: "Can I use Nubian Velvet on my face?",
    a: "Yes — it is gentle enough for facial use. Apply a small amount using a makeup sponge or the AIYM mitt, blending evenly.",
  },
  {
    q: "How do I remove the tan if I make a mistake?",
    a: "Gently exfoliate the area. You can also soak in a warm bath with cleansing oil, then rinse in the shower and exfoliate to fade the colour.",
  },
  {
    q: "How do I store my Nubian Velvet?",
    a: "Store in a cool, dry place away from direct sunlight and extreme temperatures to maintain quality and effectiveness.",
  },
];

export const reviews = [
  {
    name: "Zara M.",
    verified: true,
    rating: 5,
    body: "Finally a tanning mousse made FOR my skin tone. Nubian Velvet gives me the most beautiful, warm golden glow. Nothing else compares.",
  },
  {
    name: "Imani T.",
    verified: true,
    rating: 5,
    body: "No orange, no streaks — just a deep, rich colour that actually looks natural on dark skin. I'm obsessed.",
  },
  {
    name: "Aaliyah R.",
    verified: true,
    rating: 5,
    body: "I've tried every self-tanner on the market. This is the ONLY one that works the way it should on melanin-rich skin. Game changer.",
  },
];
