import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const rows = await sql`
    SELECT
      c.id, c."firstName", c."lastName", c.email, c."createdAt", c."emailVerified",
      EXISTS (
        SELECT 1 FROM "NewsletterSubscriber" ns
        WHERE ns.email = c.email AND ns.status = 'active'
      ) AS marketing,
      COUNT(o.id) AS order_count,
      COALESCE(SUM(o.total), 0) AS total_spent
    FROM "Customer" c
    LEFT JOIN "Order" o ON o."customerId" = c.id
    WHERE c.id = ${id}
    GROUP BY c.id
  `;

  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const orders = await sql`
    SELECT o.id, o."createdAt", o.total, o.status,
           (SELECT oi.name FROM "OrderItem" oi WHERE oi."orderId" = o.id LIMIT 1) AS variant
    FROM "Order" o
    WHERE o."customerId" = ${id}
    ORDER BY o."createdAt" DESC
  `;

  const c = rows[0];
  const orderCount = parseInt(String(c.order_count));
  const totalSpent = parseFloat(String(c.total_spent));

  return NextResponse.json({
    customer: {
      ...c,
      order_count: orderCount,
      total_spent: totalSpent,
      avg_order_value: orderCount > 0 ? totalSpent / orderCount : 0,
    },
    orders,
  });
}
