import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-white":        "#FFFFFF",
        "brand-cream":        "#FAF7F2",
        "brand-yellow":       "#C9A84C",
        "brand-yellow-light": "#E8D5A3",
        "brand-brown":        "#3B1F0E",
        "brand-brown-mid":    "#6B3A22",
        "brand-brown-light":  "#A07850",
        "brand-surface":      "#F0EAE0",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body:    ["Georgia", "'Times New Roman'", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
