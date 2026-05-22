import Link from "next/link";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  tagline?: string;
}

export default function AuthLayout({
  children,
  imageSrc = "/images/Picture-5.png",
  imageAlt = "AIYM brand lifestyle",
  tagline = "Crafted for melanin. Built for glow.",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left — image panel */}
      <div className="hidden md:flex relative flex-col items-end justify-end overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        {/* gradient — heavier at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0d05]/85 via-[#1a0d05]/25 to-transparent" />
        <div className="relative z-10 p-10 text-left">
          <Link href="/" className="block font-display text-4xl text-white tracking-[0.25em] mb-2">
            AIYM
          </Link>
          <p className="text-white/60 text-[11px] tracking-[0.25em] uppercase">{tagline}</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-col items-center justify-center bg-brand-white px-5 py-8 md:px-16 md:py-12 min-h-screen">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link
            href="/"
            className="block font-display text-2xl text-brand-brown tracking-widest text-center md:hidden mb-8"
          >
            AIYM
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
