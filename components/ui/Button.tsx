"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "ghost";
  loading?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  loading = false,
  children,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 uppercase tracking-widest text-sm font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-brand-brown text-brand-white hover:opacity-90 px-8 py-3",
    accent:
      "bg-brand-yellow text-brand-brown hover:bg-brand-yellow-light px-8 py-3",
    ghost:
      "bg-transparent border border-brand-brown text-brand-brown hover:bg-brand-cream px-8 py-3",
  };

  return (
    <button
      className={cn(base, variants[variant], fullWidth && "w-full", className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
