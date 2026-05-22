import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await sql`
    SELECT o.id, o.status, o.total, o."createdAt", o."trackingNumber",
           json_agg(json_build_object('name', oi.name, 'price', oi.price, 'quantity', oi.quantity)) AS items
    FROM "Order" o
    JOIN "OrderItem" oi ON oi."orderId" = o.id
    WHERE o."customerId" = ${session.sub}
    GROUP BY o.id
    ORDER BY o."createdAt" DESC
  `;

  return NextResponse.json({ orders });
}
