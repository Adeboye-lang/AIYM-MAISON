"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { X, ShoppingBag, Minus, Plus, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { product } from "@/lib/constants";
import { CartItem } from "@/lib/types";

// Image shown in cart per variant
const VARIANT_IMAGES: Record<string, string> = {
  "foam-only": "/public/Main Product.jpg",
  "foam-with-mitts": "/public/Mittens.png",
};

interface CartContextType {
  items: CartItem[];
  addItem: (variantId: string, variantLabel: string, price: number) => void;
  removeItem: (variantId: string) => void;
  updateQty: (variantId: string, qty: number) => void;
  openCart: () => void;
  closeCart: () => void;
  itemCount: number;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ id: string; code: string; discount: number } | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [applyingDiscount, setApplyingDiscount] = useState(false);

  const addItem = useCallback(
    (variantId: string, variantLabel: string, price: number) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.variantId === variantId);
        if (existing) {
          return prev.map((i) =>
            i.variantId === variantId
              ? { ...i, quantity: Math.min(i.quantity + 1, 10) }
              : i
          );
        }
        return [...prev, { variantId, variantLabel, price, quantity: 1 }];
      });
      setOpen(true);
    },
    []
  );

  const removeItem = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }, []);

  const updateQty = useCallback((variantId: string, qty: number) => {
    if (qty < 1) return;
    if (qty > 10) return;
    setItems((prev) =>
      prev.map((i) => (i.variantId === variantId ? { ...i, quantity: qty } : i))
    );
  }, []);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setApplyingDiscount(true);
    setDiscountError("");
    try {
      const res = await fetch("/api/discounts/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountCode, subtotal: total }),
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedDiscount({ id: data.id, code: data.code, discount: data.discount });
      } else {
        setDiscountError(data.error ?? "Invalid code");
      }
    } finally {
      setApplyingDiscount(false);
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      // Require account before checkout
      const meRes = await fetch("/api/account/me");
      const meData = await meRes.json();
      if (!meData.user) {
        window.location.href = "/auth/login?redirect=/";
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
          discountCodeId: appliedDiscount?.id ?? null,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data.error);
        alert(data.error ?? "Checkout failed. Please try again.");
      }
    } catch {
      alert("Checkout failed. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountAmount = appliedDiscount?.discount ?? 0;
  const grandTotal = Math.max(0, total - discountAmount);
  const FREE_DELIVERY_THRESHOLD = 40;
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - total);
  const progressPct = Math.min(100, (total / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        openCart: () => setOpen(true),
        closeCart: () => setOpen(false),
        itemCount,
        total,
      }}
    >
      {children}

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-brand-brown/50 z-50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-brand-white z-50 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-yellow">
          <h2 className="font-display text-xl text-brand-brown uppercase tracking-widest">
            Your Bag
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-brand-brown-light hover:text-brand-brown transition-colors"
            aria-label="Close bag"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
            <ShoppingBag className="h-12 w-12 text-brand-brown-light" />
            <p className="text-brand-brown-light text-sm uppercase tracking-wide">
              Your bag is empty.
            </p>
            <Button variant="accent" onClick={() => setOpen(false)}>
              <Link href="/">Shop Now</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.map((item) => {
                const imgSrc = VARIANT_IMAGES[item.variantId] ?? "/public/Main Product.jpg";
                return (
                  <div key={item.variantId} className="flex gap-4">
                    <div className="w-20 h-20 bg-brand-surface flex-shrink-0 overflow-hidden">
                      <Image
                        src={imgSrc}
                        alt={item.variantLabel}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-brand-brown text-sm font-medium">
                        {product.name}
                      </p>
                      <p className="text-brand-brown-light text-xs mb-2">
                        {item.variantLabel}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-brand-brown-light">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            className="px-2 py-1 text-brand-brown hover:bg-brand-surface transition-colors"
                            onClick={() => updateQty(item.variantId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 text-xs text-brand-brown">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            className="px-2 py-1 text-brand-brown hover:bg-brand-surface transition-colors"
                            onClick={() => updateQty(item.variantId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-brand-brown text-sm font-medium">
                          £{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.variantId)}
                        className="text-xs text-brand-brown-light hover:text-red-500 mt-2 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-brand-yellow p-6 space-y-4">
              {remaining > 0 ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-brand-brown-mid">
                    <Truck className="h-4 w-4 text-brand-yellow" />
                    <span>Add £{remaining.toFixed(2)} more for free delivery</span>
                  </div>
                  <div className="w-full bg-brand-surface h-1">
                    <div
                      className="bg-brand-yellow h-1 transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <Truck className="h-4 w-4" />
                  <span>You qualify for free UK delivery!</span>
                </div>
              )}
              {/* Discount code */}
              {appliedDiscount ? (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-600 font-medium">Code: {appliedDiscount.code} applied</span>
                  <button type="button" onClick={() => { setAppliedDiscount(null); setDiscountCode(""); }} className="text-brand-brown-light hover:text-red-500 transition-colors">Remove</button>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Discount code"
                      value={discountCode}
                      onChange={(e) => { setDiscountCode(e.target.value.toUpperCase()); setDiscountError(""); }}
                      className="flex-1 border border-brand-brown-light text-brand-brown px-3 py-2 text-xs outline-none focus:border-brand-yellow bg-brand-white uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      disabled={applyingDiscount || !discountCode.trim()}
                      className="px-4 py-2 text-xs uppercase tracking-widest border border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-brand-brown transition-colors disabled:opacity-50"
                    >
                      {applyingDiscount ? "..." : "Apply"}
                    </button>
                  </div>
                  {discountError && <p className="text-xs text-red-500">{discountError}</p>}
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-brown-mid uppercase tracking-wide">Subtotal</span>
                <span className="text-sm text-brand-brown">£{total.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-green-600 text-sm">
                  <span>Discount</span>
                  <span>-£{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-brown-mid uppercase tracking-wide">Total</span>
                <span className="font-display text-xl text-brand-brown font-bold">£{grandTotal.toFixed(2)}</span>
              </div>
              <Button
                variant="accent"
                fullWidth
                loading={checkingOut}
                onClick={handleCheckout}
              >
                Checkout — Pay Securely
              </Button>
              <p className="text-center text-[10px] text-brand-brown-light uppercase tracking-widest">
                Secured by Stripe · SSL encrypted
              </p>
            </div>
          </>
        )}
      </div>
    </CartContext.Provider>
  );
}
