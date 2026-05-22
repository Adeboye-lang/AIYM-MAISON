import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await sql`SELECT id, email, "firstName", "lastName", role, "createdAt", "emailVerified" FROM "Customer" WHERE id = ${session.sub} LIMIT 1`;
  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ user: rows[0] });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { firstName, lastName, currentPassword, newPassword } = await req.json();

  if (firstName || lastName) {
    await sql`
      UPDATE "Customer"
      SET "firstName" = COALESCE(${firstName ?? null}, "firstName"),
          "lastName"  = COALESCE(${lastName ?? null}, "lastName")
      WHERE id = ${session.sub}
    `;
  }

  if (newPassword) {
    const rows = await sql`SELECT "passwordHash" FROM "Customer" WHERE id = ${session.sub} LIMIT 1`;
    if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const valid = await bcrypt.compare(currentPassword ?? "", rows[0].passwordHash ?? "");
    if (!valid) return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });

    const hash = await bcrypt.hash(newPassword, 12);
    await sql`UPDATE "Customer" SET "passwordHash" = ${hash} WHERE id = ${session.sub}`;
  }

  return NextResponse.json({ success: true });
}
