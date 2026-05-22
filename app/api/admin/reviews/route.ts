import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";

  const reviews = await sql`
    SELECT id, name, rating, text AS body, status, "createdAt"
    FROM "Review"
    WHERE (
      ${search} = '' OR
      name ILIKE ${'%' + search + '%'} OR
      text ILIKE ${'%' + search + '%'}
    )
    AND (${status} = '' OR status = ${status.toLowerCase()})
    ORDER BY "createdAt" DESC
  `;

  const stats = await sql`
    SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'pending') AS pending,
      COUNT(*) FILTER (WHERE status = 'approved') AS approved,
      COUNT(*) FILTER (WHERE status = 'rejected') AS rejected,
      ROUND(AVG(rating)::numeric, 1) AS avg_rating
    FROM "Review"
  `;

  return NextResponse.json({ reviews, stats: stats[0] });
}
