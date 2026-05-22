import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { CartProvider } from "@/components/storefront/CartDrawer";

export const metadata = { title: "Terms & Conditions — AIYM" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-widest text-brand-brown mb-3">{title}</h2>
      <div className="text-brand-brown-mid text-sm leading-relaxed space-y-3">{children}</div>
      <div className="h-px bg-brand-yellow w-full mt-8" />
    </div>
  );
}

export default function TermsPage() {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-brand-cream">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1 pt-24 md:pt-32 pb-12 md:pb-20">
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="font-display text-5xl md:text-6xl text-brand-brown uppercase tracking-widest mb-4">
              Terms & Conditions
            </h1>
            <div className="h-px bg-brand-yellow w-full mb-4" />
            <p className="text-brand-brown-light text-xs uppercase tracking-widest mb-12">
              Last updated: April 2026
            </p>

            <p className="text-brand-brown-mid text-sm leading-relaxed mb-8">
              To shop with AIYM you must be at least 18 years old. By accessing this website, you
              agree to these terms. If you do not agree, please stop using the site.
            </p>

            <div className="space-y-8">
              <Section title="Order Placement & Pricing">
                <p>
                  All orders are subject to availability and confirmation of the order price. All
                  prices are quoted in GB Pound Sterling and include VAT where applicable at the
                  current rate. Prices are subject to change in response to currency exchange rates,
                  markdowns, or other commercial factors.
                </p>
              </Section>

              <Section title="Withdrawal, Returns & Cancellation">
                <p>
                  You may return your order within <strong>7 days of delivery</strong> for a refund,
                  provided products are in original condition and unopened.{" "}
                  <strong>Opened or damaged items are non-refundable.</strong> Return shipping costs
                  are the customer&apos;s responsibility. If your order is returned or undeliverable
                  due to incorrect details, only the item cost will be refunded — not the shipping
                  cost.
                </p>
              </Section>

              <Section title="Faulty or Incorrect Items">
                <p>
                  If you receive an incorrect or faulty product, please email{" "}
                  <a href="mailto:support@maisonaiym.com" className="text-brand-yellow hover:underline">
                    support@maisonaiym.com
                  </a>{" "}
                  with your order name, your order number, and a photo of the faulty item. We will
                  work to resolve the issue promptly.
                </p>
              </Section>

              <Section title="Ordering Conditions">
                <p>
                  By clicking &ldquo;Confirm and Pay&rdquo; you enter into an obligation to pay. A
                  contract is formed when we email you to confirm that your order has been dispatched.
                  We aim to deliver all orders within <strong>30 days</strong> of the purchase date.
                  Risk of damage or loss passes to you upon delivery.
                </p>
              </Section>

              <Section title="Legal">
                <p>
                  This contract is governed by the laws of England and Wales. Complaints:{" "}
                  <a href="mailto:support@maisonaiym.com" className="text-brand-yellow hover:underline">
                    support@maisonaiym.com
                  </a>{" "}
                  — we aim to respond within <strong>5 days</strong>.
                </p>
              </Section>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
