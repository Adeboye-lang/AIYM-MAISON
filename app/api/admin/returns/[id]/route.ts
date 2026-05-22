import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";
import { getStripe } from "@/lib/stripe";
import { sendRefundEmail } from "@/lib/email";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { status, refundAmt, adminNotes } = await req.json();

  // Fetch return + linked order for Stripe payment intent and customer email
  const [ret] = await sql`
    SELECT r.*, o.email, o."stripePaymentIntent"
    FROM "Return" r
    LEFT JOIN "Order" o ON o.id = r."orderId"
    WHERE r.id = ${id}
  `;

  if (!ret) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // If approving refund and a Stripe payment intent exists, issue real Stripe refund
  if (status === "refund_issued" && ret.status !== "refund_issued") {
    const amt = refundAmt ?? ret.refundamt;
    if (ret.stripepaymentintent && amt) {
      try {
        const stripe = getStripe();
        await stripe.refunds.create({
          payment_intent: ret.stripepaymentintent,
          amount: Math.round(parseFloat(String(amt)) * 100),
        });
      } catch (err) {
        console.error("Stripe refund failed:", err);
        return NextResponse.json({ error: "Stripe refund failed. Check logs." }, { status: 500 });
      }
    }

    if (ret.email && amt) {
      await sendRefundEmail(ret.email, ret.orderid, parseFloat(String(amt))).catch(console.error);
    }
  }

  await sql`
    UPDATE "Return"
    SET status = COALESCE(${status ?? null}, status),
        "refundAmt" = COALESCE(${refundAmt ?? null}, "refundAmt"),
        "adminNotes" = COALESCE(${adminNotes ?? null}, "adminNotes"),
        "updatedAt" = NOW()
    WHERE id = ${id}
  `;

  return NextResponse.json({ success: true });
}
