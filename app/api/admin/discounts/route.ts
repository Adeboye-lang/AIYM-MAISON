import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rows = await sql`SELECT * FROM "DiscountCode" ORDER BY "createdAt" DESC`;
  return NextResponse.json({ codes: rows });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { code, type, value, minOrder, maxUses, expiresAt } = await req.json();

  if (!code || !type || value == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const id = randomUUID();
  await sql`
    INSERT INTO "DiscountCode" (id, code, type, value, "minOrder", "maxUses", "expiresAt")
    VALUES (${id}, ${code.toUpperCase()}, ${type}, ${value}, ${minOrder ?? 0}, ${maxUses ?? null}, ${expiresAt ?? null})
  `;

  return NextResponse.json({ id }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, active } = await req.json();
  await sql`UPDATE "DiscountCode" SET active = ${active} WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  await sql`DELETE FROM "DiscountCode" WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
