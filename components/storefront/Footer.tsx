import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="h-px bg-brand-yellow w-full" />
      <div className="bg-brand-cream">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <span className="font-display text-4xl text-brand-yellow tracking-widest">AIYM</span>
            <p className="text-brand-brown-light text-sm">Crafted for melanin. Built for glow.</p>
            <a
              href="mailto:support@maisonaiym.com"
              className="text-sm text-brand-brown-mid hover:text-brand-yellow transition-colors"
            >
              support@maisonaiym.com
            </a>
          </div>

          {/* Navigate */}
          <div className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-widest text-brand-yellow">Navigate</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Contact", href: "mailto:support@maisonaiym.com" },
                { label: "Delivery, Returns & Refunds", href: "/delivery" },
                { label: "Terms & Conditions", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "FAQs", href: "/faqs" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-brand-brown-mid hover:text-brand-yellow transition-colors underline-offset-4 hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-widest text-brand-yellow">Follow Us</p>
            <p className="text-sm text-brand-brown-light">Stay up to date on our socials.</p>
            <div className="flex gap-5">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/maisonaiym"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-brand-brown-light hover:text-brand-yellow transition-colors group"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                </svg>
                <span className="text-xs tracking-wide">@maisonaiym</span>
              </a>
            </div>
            <div className="flex gap-5">
              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@maisonaiym"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-brand-brown-light hover:text-brand-yellow transition-colors group"
                aria-label="TikTok"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.02a8.26 8.26 0 004.84 1.56V7.13a4.85 4.85 0 01-1.07-.44z" />
                </svg>
                <span className="text-xs tracking-wide">@maisonaiym</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-brand-brown text-center py-4 px-6">
        <p className="text-white text-xs tracking-wide">
          © Maison AIYM 2026 · support@maisonaiym.com
        </p>
      </div>
    </footer>
  );
}
