import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const tab = searchParams.get("tab") ?? "Active";

    // Fetch all, filter in JS to avoid complex parametrized SQL conditionals
    const all = await sql`
      SELECT id, name, email, source, active, "createdAt"
      FROM "NewsletterSubscriber"
      ORDER BY "createdAt" DESC
    `;

    const q = search.toLowerCase();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscribers = all.filter((s: any) => {
      const matchSearch = !q ||
        (s.email ?? "").toLowerCase().includes(q) ||
        (s.name ?? "").toLowerCase().includes(q);
      const matchTab =
        tab === "All" ||
        (tab === "Active" && s.active === true) ||
        (tab === "Unsubscribed" && s.active === false);
      return matchSearch && matchTab;
    });

    const stats = await sql`
      SELECT
        COUNT(*) FILTER (WHERE active = true) AS active_count,
        COUNT(*) FILTER (WHERE active = false) AS unsubscribed_count,
        COUNT(*) FILTER (WHERE active = true AND "createdAt" >= NOW() - INTERVAL '7 days') AS new_this_week
      FROM "NewsletterSubscriber"
    `;

    return NextResponse.json({ subscribers, stats: stats[0] });
  } catch (err) {
    console.error("Admin newsletter GET error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await req.json();
    await sql`UPDATE "NewsletterSubscriber" SET active = false, "updatedAt" = NOW() WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin newsletter PATCH error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
