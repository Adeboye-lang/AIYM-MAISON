import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

export async function GET() {
  const reviews = await sql`
    SELECT id, name, rating, text AS body, "createdAt"
    FROM "Review"
    WHERE status = 'approved'
    ORDER BY "createdAt" DESC
    LIMIT 20
  `;
  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "You must be signed in to leave a review." }, { status: 401 });
    }

    const { rating, text } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
    }
    if (!text?.trim() || text.trim().length < 10) {
      return NextResponse.json({ error: "Review must be at least 10 characters." }, { status: 400 });
    }

    const name = `${session.firstName} ${session.lastName}`.trim() || "Anonymous";

    await sql`
      INSERT INTO "Review" (id, "productId", "customerId", name, email, rating, text, status, "createdAt")
      VALUES (
        ${randomUUID()},
        'nubian-velvet-tanning-mousse',
        ${session.sub},
        ${name},
        ${session.email},
        ${rating},
        ${text.trim()},
        'pending',
        NOW()
      )
    `;

    return NextResponse.json({ success: true, message: "Thank you! Your review is pending approval." });
  } catch (err) {
    console.error("Review POST error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
