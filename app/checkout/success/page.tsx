import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="max-w-md space-y-6">
        <p className="font-display text-6xl text-brand-yellow">✓</p>
        <h1 className="font-display text-4xl text-brand-brown uppercase tracking-widest">Order Confirmed</h1>
        <div className="h-px bg-brand-yellow w-full" />
        <p className="text-brand-brown-mid text-sm leading-relaxed">
          Thank you for your order. You&apos;ll receive a confirmation email shortly.
          Your glow is on its way.
        </p>
        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/account/orders"
            className="w-full text-center uppercase tracking-widest text-xs font-medium px-6 py-4 bg-brand-yellow text-brand-brown hover:bg-brand-yellow-light transition-colors"
          >
            View My Orders
          </Link>
          <Link
            href="/"
            className="text-xs text-brand-brown-light hover:text-brand-yellow transition-colors uppercase tracking-widest"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
