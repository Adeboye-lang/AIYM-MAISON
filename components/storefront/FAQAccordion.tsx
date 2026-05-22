import Accordion from "@/components/ui/Accordion";
import { faqs } from "@/lib/constants";

export default function FAQAccordion() {
  return (
    <section className="bg-brand-white">
      <div className="h-px bg-brand-yellow w-full" />
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl text-brand-brown uppercase tracking-widest mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-brand-brown-light text-sm">
            Everything you need to know about Nubian Velvet.
          </p>
        </div>

        <Accordion items={faqs} />

        <div className="text-center mt-12">
          <p className="text-brand-brown-mid text-sm mb-4">Still have questions?</p>
          <a
            href="mailto:support@maisonaiym.com"
            className="inline-flex items-center uppercase tracking-widest text-xs font-medium px-8 py-3 border border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white transition-colors"
          >
            Email Us
          </a>
        </div>
      </div>
    </section>
  );
}
