import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { CartProvider } from "@/components/storefront/CartDrawer";

export const metadata = { title: "Delivery, Returns & Refunds — AIYM" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-widest text-brand-brown mb-3">{title}</h2>
      <div className="text-brand-brown-mid text-sm leading-relaxed">{children}</div>
      <div className="h-px bg-brand-yellow w-full mt-8" />
    </div>
  );
}

export default function DeliveryPage() {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-brand-cream">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1 pt-24 md:pt-32 pb-12 md:pb-20">
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="font-display text-5xl md:text-6xl text-brand-brown uppercase tracking-widest mb-4">
              Delivery, Returns & Refunds
            </h1>
            <div className="h-px bg-brand-yellow w-full mb-4" />
            <p className="text-brand-brown-light text-xs uppercase tracking-widest mb-12">
              Last updated: April 2026
            </p>

            <div className="space-y-8">
              <Section title="Delivery">
                <p>
                  We offer Royal Mail 1st and 2nd class tracked UK shipping service for all orders.
                </p>
              </Section>

              <Section title="Returns — Faulty Goods">
                <p>
                  All goods purchased from AIYM must be returned within <strong>14 days</strong> of
                  receipt of delivery to be eligible for a refund, exchange, or replacement. Before
                  sending the parcel back to us, please request a return via email to{" "}
                  <a href="mailto:support@maisonaiym.com" className="text-brand-yellow hover:underline">
                    support@maisonaiym.com
                  </a>
                  .
                </p>
                <p className="mt-3">
                  We are unable to replace or refund a faulty item until the original is returned to
                  AIYM.
                </p>
              </Section>

              <Section title="Returns — Cancellation of Order">
                <p>
                  You must take care of our goods whilst they are in your possession. Items must be in
                  their original condition, unopened and as new with the original seal untampered.
                </p>
                <p className="mt-3">
                  Please note that if you have paid for shipping, this will not be refunded — only the
                  item cost. Returns must be paid by the customer. We recommend sending your return
                  using a tracked service. For any orders outside the UK, the cost of return falls
                  with the purchaser.
                </p>
                <p className="mt-3">
                  Please contact our customer service team at{" "}
                  <a href="mailto:support@maisonaiym.com" className="text-brand-yellow hover:underline">
                    support@maisonaiym.com
                  </a>{" "}
                  with your order number and reason for return.
                </p>
                <p className="mt-3">
                  You and your carrier are responsible for returned goods until they reach our
                  warehouse. We try to process refunds within one week of receipt, and promise to make
                  all refunds within <strong>14 calendar days</strong> from receipt of goods at our
                  warehouse.
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
