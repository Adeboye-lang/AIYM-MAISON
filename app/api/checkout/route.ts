import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSession } from "@/lib/auth-helpers";
import sql from "@/lib/db";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// Fallback prices in pence if DB is unreachable
const FALLBACK_PRICES: Record<string, { name: string; price: number; image: string }> = {
  "foam-only": { name: "Nubian Velvet — Tanning Foam", price: 2600, image: `${APP_URL}/public/Main%20Product.jpg` },
  "foam-with-mitts": { name: "Nubian Velvet — Tanning Foam + Mitts", price: 2800, image: `${APP_URL}/public/Mittens.png` },
};

async function getVariantPrices(): Promise<Record<string, { name: string; price: number; image: string }>> {
  try {
    const rows = await sql`SELECT name, "variantKey", price, images FROM "Product" WHERE "variantKey" IS NOT NULL`;
    const map: Record<string, { name: string; price: number; image: string }> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows.forEach((r: any) => {
      map[r.variantKey] = {
        name: r.name,
        price: Math.round(r.price * 100), // convert £ to pence
        image: r.images?.[0] ? `${APP_URL}${r.images[0]}` : FALLBACK_PRICES[r.variantKey]?.image ?? "",
      };
    });
    return Object.keys(map).length > 0 ? map : FALLBACK_PRICES;
  } catch {
    return FALLBACK_PRICES;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const session = await getSession();
    const stripe = getStripe();
    const variantPrices = await getVariantPrices();

    const lineItems = items.map((item: { variantId: string; quantity: number }) => {
      const variant = variantPrices[item.variantId];
      if (!variant) throw new Error(`Unknown variant: ${item.variantId}`);
      return {
        price_data: {
          currency: "gbp",
          product_data: {
            name: variant.name,
            images: [variant.image],
          },
          unit_amount: variant.price,
        },
        quantity: item.quantity,
      };
    });

    const subtotal = items.reduce((sum: number, item: { variantId: string; quantity: number }) => {
      const v = variantPrices[item.variantId];
      return sum + (v?.price ?? 0) * item.quantity;
    }, 0);

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      // Free shipping over £40
      shipping_options: subtotal >= 4000
        ? [{ shipping_rate_data: { type: "fixed_amount", fixed_amount: { amount: 0, currency: "gbp" }, display_name: "Free UK Delivery" } }]
        : [{ shipping_rate_data: { type: "fixed_amount", fixed_amount: { amount: 395, currency: "gbp" }, display_name: "Standard UK Delivery (3–5 days)" } }],
      shipping_address_collection: { allowed_countries: ["GB", "IE"] },
      success_url: `${APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/`,
      metadata: {
        customerId: session?.sub ?? "",
        customerEmail: session?.email ?? "",
        isPreOrder: "true",
      },
      ...(session?.email ? { customer_email: session.email } : {}),
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Checkout error:", err);
    const message = err instanceof Error ? err.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
