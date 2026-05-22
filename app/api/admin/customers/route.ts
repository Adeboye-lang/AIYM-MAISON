import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";

  const customers = await sql`
    SELECT c.id, c."firstName", c."lastName", c.email, c."createdAt", c."emailVerified",
           COUNT(o.id) AS order_count,
           COALESCE(SUM(o.total), 0) AS total_spent
    FROM "Customer" c
    LEFT JOIN "Order" o ON o."customerId" = c.id
    WHERE c.role = 'customer'
    AND (
      ${search} = '' OR
      c.email ILIKE ${'%' + search + '%'} OR
      c."firstName" ILIKE ${'%' + search + '%'} OR
      c."lastName" ILIKE ${'%' + search + '%'}
    )
    GROUP BY c.id
    ORDER BY c."createdAt" DESC
  `;

  return NextResponse.json({ customers });
}
