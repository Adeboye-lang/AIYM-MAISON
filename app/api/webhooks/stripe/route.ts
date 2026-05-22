import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getStripe } from "@/lib/stripe";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret || webhookSecret.startsWith("whsec_REPLACE")) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any;
  try {
    const rawBody = await req.text();
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    try {
      const stripe = getStripe();
      // Get line items from Stripe
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 });

      const orderId = randomUUID();
      const total = (session.amount_total ?? 0) / 100;
      const shipping = (session.shipping_cost?.amount_total ?? 0) / 100;
      const customerId = session.metadata?.customerId || null;
      const email = session.customer_details?.email ?? session.metadata?.customerEmail ?? "";

      // Create the order
      await sql`
        INSERT INTO "Order" (id, "customerId", email, status, total, shipping, "createdAt", "updatedAt")
        VALUES (${orderId}, ${customerId}, ${email}, 'processing', ${total}, ${shipping}, NOW(), NOW())
      `;

      // Create order items
      for (const item of lineItems.data) {
        await sql`
          INSERT INTO "OrderItem" (id, "orderId", name, price, quantity)
          VALUES (${randomUUID()}, ${orderId}, ${item.description ?? "Product"}, ${(item.amount_total ?? 0) / 100 / (item.quantity ?? 1)}, ${item.quantity ?? 1})
        `;
      }

      // Create shipping address if provided
      const addr = session.shipping_details?.address;
      if (addr) {
        await sql`
          INSERT INTO "Address" (id, "orderId", line1, line2, city, postcode, country)
          VALUES (
            ${randomUUID()}, ${orderId},
            ${addr.line1 ?? ""}, ${addr.line2 ?? null},
            ${addr.city ?? ""}, ${addr.postal_code ?? ""},
            ${addr.country ?? "GB"}
          )
        `;
      }

      console.log(`Order ${orderId} created from Stripe session ${session.id}`);
    } catch (err) {
      console.error("Failed to create order from webhook:", err);
      // Return 200 so Stripe doesn't retry — log for manual recovery
      return NextResponse.json({ received: true, warning: "Order creation failed, check logs." });
    }
  }

  return NextResponse.json({ received: true });
}
