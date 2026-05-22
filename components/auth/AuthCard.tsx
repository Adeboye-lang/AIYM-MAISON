import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
}

export default function AuthCard({
  children,
  imageSrc = "/public/Picture 9.jpg",
  imageAlt = "AIYM brand lifestyle",
}: AuthCardProps) {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-6 py-12">
      {/* Full-screen background image */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover object-center"
        priority
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#1a0d05]/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <Link
          href="/"
          className="font-display text-3xl text-white tracking-[0.25em] mb-8 hover:text-brand-yellow transition-colors"
        >
          AIYM
        </Link>
        <div className="w-full max-w-md bg-brand-white border-t-[3px] border-brand-yellow p-8 shadow-2xl">
          {children}
        </div>
        <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mt-6">
          Crafted for melanin. Built for glow.
        </p>
      </div>
    </div>
  );
}
