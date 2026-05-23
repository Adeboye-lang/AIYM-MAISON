import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getStripe } from "@/lib/stripe";
import sql from "@/lib/db";
import { sendAdminNewOrderEmail, sendOrderConfirmationEmail } from "@/lib/email";

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

      const paymentIntent = session.payment_intent ?? null;
      const orderStatus = session.metadata?.isPreOrder === "true" ? "pre-order" : "processing";

      // Create the order
      await sql`
        INSERT INTO "Order" (id, "customerId", email, status, total, shipping, "stripePaymentIntent", "createdAt", "updatedAt")
        VALUES (${orderId}, ${customerId}, ${email}, ${orderStatus}, ${total}, ${shipping}, ${paymentIntent}, NOW(), NOW())
      `;

      // Create order items and build summary string for emails
      const itemLines: string[] = [];
      for (const item of lineItems.data) {
        const itemPrice = (item.amount_total ?? 0) / 100 / (item.quantity ?? 1);
        await sql`
          INSERT INTO "OrderItem" (id, "orderId", name, price, quantity)
          VALUES (${randomUUID()}, ${orderId}, ${item.description ?? "Product"}, ${itemPrice}, ${item.quantity ?? 1})
        `;
        itemLines.push(`${item.description ?? "Product"} × ${item.quantity ?? 1} — £${((item.amount_total ?? 0) / 100).toFixed(2)}`);

        // Decrement stock for matching product variant
        await sql`
          UPDATE "Product"
          SET "stockCount" = GREATEST(0, "stockCount" - ${item.quantity ?? 1}),
              "updatedAt" = NOW()
          WHERE name ILIKE ${'%' + (item.description ?? '') + '%'}
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

      const itemsSummary = itemLines.join("<br/>");

      // Send admin notification and customer confirmation (non-blocking)
      await Promise.allSettled([
        sendAdminNewOrderEmail(orderId, email, total, itemsSummary),
        sendOrderConfirmationEmail(email, orderId, total, itemsSummary),
      ]);

      console.log(`Order ${orderId} created from Stripe session ${session.id}`);
    } catch (err) {
      console.error("Failed to create order from webhook:", err);
      // Return 200 so Stripe doesn't retry — log for manual recovery
      return NextResponse.json({ received: true, warning: "Order creation failed, check logs." });
    }
  }

  return NextResponse.json({ received: true });
}
