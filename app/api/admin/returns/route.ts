import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";

  const returns = await sql`
    SELECT id, "orderId", customer, reason, message, status, "refundAmt", "adminNotes", "createdAt"
    FROM "Return"
    WHERE (
      ${search} = '' OR
      customer ILIKE ${'%' + search + '%'} OR
      "orderId" ILIKE ${'%' + search + '%'}
    )
    AND (${status} = '' OR status = ${status.toLowerCase().replace(' ', '_')})
    ORDER BY "createdAt" DESC
  `;

  const stats = await sql`
    SELECT
      COUNT(*) FILTER (WHERE status = 'pending') AS pending,
      COALESCE(SUM("refundAmt") FILTER (WHERE status = 'refund_issued' AND "createdAt" >= date_trunc('month', NOW())), 0) AS refunds_this_month
    FROM "Return"
  `;

  return NextResponse.json({ returns, stats: stats[0] });
}
