import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await sql`
    SELECT id FROM "NewsletterSubscriber" WHERE email = (
      SELECT email FROM "Customer" WHERE id = ${session.sub}
    ) AND status = 'active' LIMIT 1
  `;

  return NextResponse.json({ marketing: rows.length > 0 });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { marketing } = await req.json();

  const customerRows = await sql`SELECT email, "firstName", "lastName" FROM "Customer" WHERE id = ${session.sub} LIMIT 1`;
  if (customerRows.length === 0) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

  const { email, firstName, lastName } = customerRows[0] as { email: string; firstName: string; lastName: string };
  const name = `${firstName} ${lastName}`.trim();

  if (marketing) {
    await sql`
      INSERT INTO "NewsletterSubscriber" (id, name, email, source, status)
      VALUES (gen_random_uuid()::TEXT, ${name}, ${email}, 'account', 'active')
      ON CONFLICT (email) DO UPDATE SET status = 'active'
    `;
  } else {
    await sql`UPDATE "NewsletterSubscriber" SET status = 'unsubscribed' WHERE email = ${email}`;
  }

  return NextResponse.json({ success: true });
}
