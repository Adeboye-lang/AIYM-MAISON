import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/newsletter/unsubscribe?error=missing", req.url));

  const rows = await sql`
    SELECT id FROM "NewsletterSubscriber" WHERE "unsubToken" = ${token} AND status = 'active' LIMIT 1
  `;

  if (rows.length === 0) {
    return NextResponse.redirect(new URL("/newsletter/unsubscribe?error=invalid", req.url));
  }

  await sql`UPDATE "NewsletterSubscriber" SET status = 'unsubscribed' WHERE "unsubToken" = ${token}`;
  return NextResponse.redirect(new URL("/newsletter/unsubscribe?success=1", req.url));
}

export async function POST(req: NextRequest) {
  const { token, email } = await req.json();

  if (token) {
    await sql`UPDATE "NewsletterSubscriber" SET status = 'unsubscribed' WHERE "unsubToken" = ${token}`;
  } else if (email) {
    await sql`UPDATE "NewsletterSubscriber" SET status = 'unsubscribed' WHERE email = ${email.toLowerCase()}`;
  } else {
    return NextResponse.json({ error: "Token or email required" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
