import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 20;
  const offset = (page - 1) * limit;

  const orders = await sql`
    SELECT o.id, o.status, o.total, o.shipping, o."createdAt", o."trackingNumber", o.email,
           COALESCE(c."firstName" || ' ' || c."lastName", o.email) AS customer,
           (SELECT name FROM "OrderItem" WHERE "orderId" = o.id LIMIT 1) AS variant
    FROM "Order" o
    LEFT JOIN "Customer" c ON c.id = o."customerId"
    WHERE (
      ${search} = '' OR
      o.id ILIKE ${'%' + search + '%'} OR
      o.email ILIKE ${'%' + search + '%'} OR
      COALESCE(c."firstName" || ' ' || c."lastName", '') ILIKE ${'%' + search + '%'}
    )
    AND (${status} = '' OR o.status = ${status.toLowerCase()})
    ORDER BY o."createdAt" DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const [{ count }] = await sql`
    SELECT COUNT(*) FROM "Order" o
    LEFT JOIN "Customer" c ON c.id = o."customerId"
    WHERE (
      ${search} = '' OR
      o.id ILIKE ${'%' + search + '%'} OR
      o.email ILIKE ${'%' + search + '%'} OR
      COALESCE(c."firstName" || ' ' || c."lastName", '') ILIKE ${'%' + search + '%'}
    )
    AND (${status} = '' OR o.status = ${status.toLowerCase()})
  `;

  return NextResponse.json({ orders, total: parseInt(count), page, limit });
}
