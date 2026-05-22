"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useCart } from "./CartDrawer";

interface SearchProduct { id: string; name: string; price: number; variantkey?: string; }
interface SearchPage { title: string; href: string; }

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [pages, setPages] = useState<SearchPage[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const { openCart, itemCount } = useCart();

  useEffect(() => {
    fetch("/api/account/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.user?.firstName) setFirstName(d.user.firstName); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) { setProducts([]); setPages([]); return; }
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((r) => r.ok ? r.json() : { products: [], pages: [] })
        .then((d) => { setProducts(d.products ?? []); setPages(d.pages ?? []); });
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  const closeSearch = () => { setSearchOpen(false); setQuery(""); setProducts([]); setPages([]); };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/#story" },
    { label: "How To Use", href: "/#how-to-use" },
    { label: "FAQs", href: "/faqs" },
  ];

  return (
    <>
      <nav className="fixed top-10 left-0 right-0 z-40 bg-brand-white border-b border-brand-yellow shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

          {/* Left nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] uppercase tracking-widest font-medium text-brand-brown hover:text-brand-yellow transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Centre logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center"
          >
            <Image
              src="/images/New-Logo.png"
              alt="AIYM"
              width={90}
              height={48}
              className="object-contain"
              priority
            />
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-4 text-brand-brown">
            <button type="button" title="Search" onClick={() => setSearchOpen(true)} className="hover:text-brand-yellow transition-colors hidden md:block" aria-label="Search">
              <Search className="h-4 w-4" />
            </button>
            <Link href="/account/dashboard" className="hover:text-brand-yellow transition-colors hidden md:flex items-center gap-1.5" aria-label="Account">
              <User className="h-4 w-4" />
              {firstName && (
                <span className="text-[11px] uppercase tracking-wide">{firstName}</span>
              )}
            </Link>
            <button
              type="button"
              title="Open cart"
              onClick={openCart}
              className="hover:text-brand-yellow transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-yellow text-brand-brown text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              type="button"
              title="Open menu"
              className="md:hidden hover:text-brand-yellow transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Search modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-brand-brown/60 backdrop-blur-sm" onClick={closeSearch} />
          <div className="absolute top-0 left-0 right-0 bg-brand-white border-b border-brand-yellow shadow-lg">
            <div className="max-w-2xl mx-auto px-6 py-4">
              <div className="flex items-center gap-4">
                <Search className="h-4 w-4 text-brand-brown-light flex-shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search products, pages..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 text-sm text-brand-brown bg-transparent outline-none placeholder:text-brand-brown-light"
                />
                <button type="button" onClick={closeSearch} aria-label="Close search">
                  <X className="h-5 w-5 text-brand-brown-light hover:text-brand-brown" />
                </button>
              </div>
              {(products.length > 0 || pages.length > 0) && (
                <div className="mt-4 pb-4 space-y-4">
                  {products.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-brand-brown-light mb-2">Products</p>
                      {products.map((p) => (
                        <Link key={p.id} href="/#product" onClick={closeSearch} className="flex items-center justify-between py-2 border-b border-brand-surface hover:text-brand-yellow transition-colors">
                          <span className="text-sm text-brand-brown">{p.name}</span>
                          <span className="text-xs text-brand-brown-mid">£{p.price.toFixed(2)}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                  {pages.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-brand-brown-light mb-2">Pages</p>
                      {pages.map((p) => (
                        <Link key={p.href} href={p.href} onClick={closeSearch} className="block py-2 text-sm text-brand-brown hover:text-brand-yellow transition-colors border-b border-brand-surface">
                          {p.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {query.length >= 2 && products.length === 0 && pages.length === 0 && (
                <p className="mt-4 pb-4 text-sm text-brand-brown-light">No results for &ldquo;{query}&rdquo;</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-brand-brown/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-full max-w-xs bg-brand-cream flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-yellow">
              <span className="font-display text-2xl font-bold tracking-widest text-brand-brown">AIYM</span>
              <button type="button" title="Close menu" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5 text-brand-brown" />
              </button>
            </div>
            {/* Mobile search */}
            <div className="px-6 pt-4 pb-2">
              <div className="flex items-center gap-3 border border-brand-brown-light/40 px-3 py-2">
                <Search className="h-4 w-4 text-brand-brown-light flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 text-sm text-brand-brown bg-transparent outline-none placeholder:text-brand-brown-light"
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (!searchOpen) setSearchOpen(true);
                  }}
                  onFocus={() => { setMobileOpen(false); setSearchOpen(true); }}
                />
              </div>
            </div>

            <nav className="flex flex-col p-6 gap-0">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="py-4 border-b border-brand-yellow/40 text-[11px] uppercase tracking-widest text-brand-brown hover:text-brand-yellow transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/account/dashboard"
                className="py-4 border-b border-brand-yellow/40 text-[11px] uppercase tracking-widest text-brand-brown hover:text-brand-yellow transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Account
              </Link>
            </nav>
            <div className="mt-auto p-6">
              <p className="font-display italic text-brand-brown-light text-sm">Crafted for melanin. Built for glow.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
