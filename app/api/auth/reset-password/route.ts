import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password || password.length < 8) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const rows = await sql`
      SELECT id FROM "Customer"
      WHERE "resetToken" = ${token}
        AND "resetTokenExpiry" > NOW()
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await sql`
      UPDATE "Customer"
      SET "passwordHash" = ${passwordHash}, "resetToken" = NULL, "resetTokenExpiry" = NULL
      WHERE id = ${rows[0].id}
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
