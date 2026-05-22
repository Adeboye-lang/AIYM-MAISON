"use client";

import { cn } from "@/lib/utils";

function getStrength(password: string): 0 | 1 | 2 | 3 {
  if (!password || password.length < 8) return 0;
  let score = 1;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  return score as 0 | 1 | 2 | 3;
}

const labels = ["Too short", "Too short", "Could be stronger", "Strong password ✓"];
const colors = ["bg-gray-200", "bg-red-400", "bg-amber-400", "bg-brand-yellow"];

export default function PasswordStrength({ password }: { password: string }) {
  const strength = getStrength(password);
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-1 transition-colors duration-300",
              strength >= i ? colors[strength] : "bg-gray-200"
            )}
          />
        ))}
      </div>
      {password && (
        <p className="text-xs text-brand-brown-light">{labels[strength]}</p>
      )}
    </div>
  );
}
