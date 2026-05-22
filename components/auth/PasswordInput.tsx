"use client";

import { useState, forwardRef, InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const [show, setShow] = useState(false);
    const inputId = id || "password";

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs uppercase tracking-widest text-brand-brown font-medium"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={show ? "text" : "password"}
            className={cn(
              "w-full bg-brand-white border border-brand-brown-light text-brand-brown px-4 py-3 pr-12 text-sm outline-none transition-colors",
              "focus:border-brand-yellow",
              "placeholder:text-brand-brown-light",
              error && "border-red-500",
              className
            )}
            {...props}
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-brown-light hover:text-brand-brown transition-colors"
            onClick={() => setShow(!show)}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
