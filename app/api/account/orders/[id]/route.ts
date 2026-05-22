import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const rows = await sql`
    SELECT o.id, o.status, o.total, o."createdAt", o."trackingNumber",
           o."shippingAddress",
           json_agg(json_build_object(
             'name', oi.name,
             'price', oi.price,
             'quantity', oi.quantity,
             'variant', oi.variant
           )) AS items
    FROM "Order" o
    JOIN "OrderItem" oi ON oi."orderId" = o.id
    WHERE o.id = ${id} AND o."customerId" = ${session.sub}
    GROUP BY o.id
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order: rows[0] });
}
