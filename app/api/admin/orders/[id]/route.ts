import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";
import { sendTrackingEmail, sendReviewRequestEmail } from "@/lib/email";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  // Fall back to the Address table when shippingAddress wasn't recorded on the
  // order itself, so older orders still show a destination.
  const rows = await sql`
    SELECT o.*, COALESCE(c."firstName" || ' ' || c."lastName", o.email) AS customer,
           c."firstName", c."lastName",
           -- Lowercase aliases: Postgres preserves the case of quoted column
           -- names, but the admin pages read them lowercased.
           c."firstName" AS firstname, c."lastName" AS lastname,
           o."createdAt" AS createdat,
           o."trackingNumber" AS trackingnumber,
           o."adminNotes" AS adminnotes,
           COALESCE(
             o."shippingAddress",
             (SELECT jsonb_build_object(
                       'line1', a.line1, 'line2', a.line2, 'city', a.city,
                       'postcode', a.postcode, 'country', a.country)
              FROM "Address" a WHERE a."orderId" = o.id LIMIT 1)
           ) AS shippingaddress
    FROM "Order" o
    LEFT JOIN "Customer" c ON c.id = o."customerId"
    WHERE o.id = ${id} LIMIT 1
  `;
  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const items = await sql`SELECT * FROM "OrderItem" WHERE "orderId" = ${id}`;
  return NextResponse.json({ order: rows[0], items });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { status, trackingNumber, adminNotes } = await req.json();

  // Fetch current order to get email and previous status
  const [order] = await sql`
    SELECT o.email, o.status AS current_status, o."trackingNumber" AS current_tracking,
           c."firstName"
    FROM "Order" o
    LEFT JOIN "Customer" c ON c.id = o."customerId"
    WHERE o.id = ${id}
  `;

  await sql`
    UPDATE "Order"
    SET status = COALESCE(${status ?? null}, status),
        "trackingNumber" = COALESCE(${trackingNumber ?? null}, "trackingNumber"),
        "adminNotes" = COALESCE(${adminNotes ?? null}, "adminNotes"),
        "updatedAt" = NOW()
    WHERE id = ${id}
  `;

  if (order) {
    // Send tracking email when tracking number is added for the first time
    if (trackingNumber && !order.current_tracking && order.email) {
      await sendTrackingEmail(order.email, id, trackingNumber).catch(console.error);
    }

    // Send review request email when status changes to Delivered
    if (status === "Delivered" && order.current_status !== "Delivered" && order.email) {
      await sendReviewRequestEmail(order.email, order.firstname ?? "", id).catch(console.error);
    }
  }

  return NextResponse.json({ success: true });
}
