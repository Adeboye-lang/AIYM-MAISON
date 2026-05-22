import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { CartProvider } from "@/components/storefront/CartDrawer";
import Accordion from "@/components/ui/Accordion";
import { faqs } from "@/lib/constants";

export const metadata = { title: "FAQs — AIYM" };

export default function FAQsPage() {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-brand-cream">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1 pt-24 md:pt-32 pb-12 md:pb-20">
          <div className="max-w-3xl mx-auto px-4 md:px-6">
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-brand-brown uppercase tracking-widest mb-4">
              Frequently Asked Questions
            </h1>
            <div className="h-px bg-brand-yellow w-full mb-4" />
            <p className="text-brand-brown-light text-sm mb-12">
              Everything you need to know about Nubian Velvet.
            </p>

            <Accordion items={faqs} />

            <div className="text-center mt-16">
              <p className="text-brand-brown-mid text-sm mb-4">Still have questions?</p>
              <a
                href="mailto:support@maisonaiym.com"
                className="text-brand-yellow uppercase tracking-widest text-sm font-medium hover:underline"
              >
                Email Us at support@maisonaiym.com
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
