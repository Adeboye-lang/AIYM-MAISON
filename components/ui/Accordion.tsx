"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export function AccordionItem({ question, answer, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-brand-yellow">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
        onClick={() => setOpen(!open)}
      >
        <span className="text-brand-brown font-medium tracking-wide text-sm uppercase">
          {question}
        </span>
        <span className="text-brand-yellow text-xl font-light flex-shrink-0">
          {open ? "−" : "+"}
        </span>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          open ? "max-h-96 pb-5" : "max-h-0"
        )}
      >
        <p className="text-brand-brown-mid leading-relaxed text-sm">{answer}</p>
      </div>
    </div>
  );
}

interface AccordionProps {
  items: { q: string; a: string }[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="border-b border-brand-yellow">
          <button
            className="w-full flex items-center justify-between py-5 text-left gap-4"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span className="text-brand-brown font-medium tracking-wide text-sm uppercase">
              {item.q}
            </span>
            <span className="text-brand-yellow text-xl font-light flex-shrink-0">
              {openIndex === i ? "−" : "+"}
            </span>
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              openIndex === i ? "max-h-96 pb-5" : "max-h-0"
            )}
          >
            <p className="text-brand-brown-mid leading-relaxed text-sm">{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
