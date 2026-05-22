import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });

    const existing = await sql`SELECT id, active FROM "NewsletterSubscriber" WHERE email = ${email.toLowerCase()} LIMIT 1`;

    if (existing.length > 0) {
      if (existing[0].active) {
        return NextResponse.json({ success: true, alreadySubscribed: true });
      }
      await sql`UPDATE "NewsletterSubscriber" SET active = true, "updatedAt" = NOW() WHERE id = ${existing[0].id}`;
      return NextResponse.json({ success: true });
    }

    await sql`
      INSERT INTO "NewsletterSubscriber" (id, email, name, source, active, "createdAt", "updatedAt")
      VALUES (${randomUUID()}, ${email.toLowerCase()}, ${name ?? null}, 'homepage', true, NOW(), NOW())
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter subscribe error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
