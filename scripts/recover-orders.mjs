/**
 * Recover paid Stripe checkouts that never became orders.
 *
 * The webhook was misconfigured for a while, so payments completed in Stripe
 * without any corresponding row in the database. This pulls completed checkout
 * sessions straight from Stripe and writes the same records the webhook would
 * have written: Order, OrderItem, Address, and Order.shippingAddress.
 *
 * Safe to run more than once — sessions that already have an order are skipped.
 *
 * Preview (writes nothing):
 *   STRIPE_SECRET_KEY=sk_live_... DATABASE_URL=postgres://... \
 *     node scripts/recover-orders.mjs
 *
 * Actually write them:
 *   STRIPE_SECRET_KEY=sk_live_... DATABASE_URL=postgres://... \
 *     node scripts/recover-orders.mjs --commit
 */

import { randomUUID } from "crypto";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";

const COMMIT = process.argv.includes("--commit");
const DAYS = 90;

if (!process.env.STRIPE_SECRET_KEY || !process.env.DATABASE_URL) {
  console.error("Missing STRIPE_SECRET_KEY or DATABASE_URL.");
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const sql = neon(process.env.DATABASE_URL);

const money = (pence) => `£${((pence ?? 0) / 100).toFixed(2)}`;

async function main() {
  console.log(
    COMMIT
      ? "── RECOVERING ORDERS (writing to the database) ──\n"
      : "── PREVIEW ONLY — nothing will be written. Re-run with --commit to apply. ──\n"
  );

  const since = Math.floor(Date.now() / 1000) - DAYS * 24 * 60 * 60;
  const sessions = await stripe.checkout.sessions.list({
    limit: 100,
    created: { gte: since },
    expand: ["data.line_items"],
  });

  const paid = sessions.data.filter(
    (s) => s.payment_status === "paid" || s.status === "complete"
  );

  console.log(`Found ${paid.length} paid checkout session(s) in the last ${DAYS} days.\n`);

  let recovered = 0;
  let skipped = 0;

  for (const session of paid) {
    const paymentIntent =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    // Skip anything already in the database, so re-runs don't duplicate.
    const existing = paymentIntent
      ? await sql`SELECT id FROM "Order" WHERE "stripePaymentIntent" = ${paymentIntent} LIMIT 1`
      : [];

    if (existing.length > 0) {
      console.log(`• ${session.id} — already recorded as order ${existing[0].id}, skipping`);
      skipped++;
      continue;
    }

    const email =
      session.customer_details?.email ?? session.metadata?.customerEmail ?? "";
    const total = (session.amount_total ?? 0) / 100;
    const shipping = (session.shipping_cost?.amount_total ?? 0) / 100;
    const customerId = session.metadata?.customerId || null;

    // Stripe moved shipping_details under collected_information in newer API
    // versions; fall back to the billing address if neither is present.
    const addr =
      session.shipping_details?.address ??
      session.collected_information?.shipping_details?.address ??
      session.customer_details?.address ??
      null;
    const addrName =
      session.shipping_details?.name ??
      session.collected_information?.shipping_details?.name ??
      session.customer_details?.name ??
      "";

    let lineItems = session.line_items?.data;
    if (!lineItems) {
      const fetched = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
      lineItems = fetched.data;
    }

    console.log(`• ${session.id}`);
    console.log(`    ${email} — ${money(session.amount_total)} (${new Date(session.created * 1000).toLocaleString("en-GB")})`);
    for (const item of lineItems) {
      console.log(`    ${item.quantity} × ${item.description ?? "Product"} — ${money(item.amount_total)}`);
    }
    console.log(
      addr
        ? `    Ship to: ${[addrName, addr.line1, addr.line2, addr.city, addr.postal_code, addr.country].filter(Boolean).join(", ")}`
        : `    Ship to: (no address on this session)`
    );

    if (!COMMIT) {
      console.log("    → would create order\n");
      recovered++;
      continue;
    }

    const orderId = randomUUID();

    await sql`
      INSERT INTO "Order" (id, "customerId", email, status, total, shipping, "stripePaymentIntent", "createdAt", "updatedAt")
      VALUES (
        ${orderId}, ${customerId}, ${email}, 'processing', ${total}, ${shipping},
        ${paymentIntent}, ${new Date(session.created * 1000).toISOString()}, NOW()
      )
    `;

    for (const item of lineItems) {
      const qty = item.quantity ?? 1;
      const unit = (item.amount_total ?? 0) / 100 / qty;
      await sql`
        INSERT INTO "OrderItem" (id, "orderId", name, price, quantity)
        VALUES (${randomUUID()}, ${orderId}, ${item.description ?? "Product"}, ${unit}, ${qty})
      `;
    }

    if (addr) {
      await sql`
        INSERT INTO "Address" (id, "orderId", line1, line2, city, postcode, country)
        VALUES (
          ${randomUUID()}, ${orderId},
          ${addr.line1 ?? ""}, ${addr.line2 ?? null},
          ${addr.city ?? ""}, ${addr.postal_code ?? ""}, ${addr.country ?? "GB"}
        )
      `;
      await sql`
        UPDATE "Order"
        SET "shippingAddress" = ${JSON.stringify({
          name: addrName,
          line1: addr.line1 ?? "",
          line2: addr.line2 ?? null,
          city: addr.city ?? "",
          postcode: addr.postal_code ?? "",
          country: addr.country ?? "GB",
        })}::jsonb
        WHERE id = ${orderId}
      `;
    }

    console.log(`    ✓ created order ${orderId}\n`);
    recovered++;
  }

  console.log("──");
  console.log(
    COMMIT
      ? `Done. ${recovered} order(s) recovered, ${skipped} already present.`
      : `Preview complete. ${recovered} order(s) would be created, ${skipped} already present.`
  );
  if (!COMMIT && recovered > 0) {
    console.log("Re-run with --commit to write them.");
  }
}

main().catch((err) => {
  console.error("\nRecovery failed:", err.message);
  process.exit(1);
});
