import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { CartProvider } from "@/components/storefront/CartDrawer";

export const metadata = { title: "Privacy Policy — AIYM" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-widest text-brand-brown mb-3">{title}</h2>
      <div className="text-brand-brown-mid text-sm leading-relaxed space-y-3">{children}</div>
      <div className="h-px bg-brand-yellow w-full mt-8" />
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-brand-cream">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1 pt-24 md:pt-32 pb-12 md:pb-20">
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="font-display text-5xl md:text-6xl text-brand-brown uppercase tracking-widest mb-4">
              Privacy Policy
            </h1>
            <div className="h-px bg-brand-yellow w-full mb-4" />
            <p className="text-brand-brown-light text-xs uppercase tracking-widest mb-12">
              Effective date: 17/04/2026
            </p>

            <div className="space-y-8">
              <Section title="What We Collect">
                <p>
                  Name, email address, delivery address and postcode, and information on how you use
                  our website.
                </p>
              </Section>

              <Section title="How We Use Your Data">
                <p>
                  To process and fulfil orders, arrange shipping, send order confirmations,
                  communicate with you, screen for fraud, and — with your consent — send marketing
                  communications about AIYM products and offers.
                </p>
              </Section>

              <Section title="Data Sharing">
                <p>
                  We do not sell your personal data to any third party. We share data only with:
                  payment service providers, delivery companies (Royal Mail), and legal or financial
                  advisers when required by law.
                </p>
              </Section>

              <Section title="Your Rights (UK GDPR)">
                <p>
                  You have the right to: withdraw marketing consent at any time, request access to
                  your personal data, request deletion of your data, object to processing, and request
                  data portability. Contact us at{" "}
                  <a href="mailto:support@maisonaiym.com" className="text-brand-yellow hover:underline">
                    support@maisonaiym.com
                  </a>{" "}
                  to exercise any of these rights.
                </p>
              </Section>

              <Section title="How Long We Hold Your Data">
                <p>
                  We retain your personal data only for as long as necessary to fulfil the purposes
                  set out in this policy, after which it will be permanently erased.
                </p>
              </Section>

              <Section title="Cookies">
                <p>
                  We use traffic log cookies to identify which pages are being used and to improve our
                  website. You may decline cookies via your browser settings, though this may limit
                  site functionality.
                </p>
              </Section>

              <Section title="Complaints">
                <p>
                  If you feel we have not handled your data correctly, you have the right to complain
                  to the Information Commissioner&apos;s Office (ICO) at{" "}
                  <span className="text-brand-brown">www.ico.org.uk</span>. Please contact us first
                  at{" "}
                  <a href="mailto:support@maisonaiym.com" className="text-brand-yellow hover:underline">
                    support@maisonaiym.com
                  </a>
                  .
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
