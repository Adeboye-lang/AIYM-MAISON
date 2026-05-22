import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { firstName, lastName, line1, line2, city, postcode, country, phone, isDefault } = body;

  // Ensure address belongs to customer
  const owns = await sql`SELECT id FROM "Address" WHERE id = ${id} AND "customerId" = ${session.sub} AND "orderId" IS NULL LIMIT 1`;
  if (owns.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (isDefault) {
    await sql`UPDATE "Address" SET "isDefault" = false WHERE "customerId" = ${session.sub} AND "orderId" IS NULL`;
  }

  await sql`
    UPDATE "Address"
    SET "firstName" = COALESCE(${firstName ?? null}, "firstName"),
        "lastName"  = COALESCE(${lastName ?? null}, "lastName"),
        line1       = COALESCE(${line1 ?? null}, line1),
        line2       = ${line2 ?? null},
        city        = COALESCE(${city ?? null}, city),
        postcode    = COALESCE(${postcode ?? null}, postcode),
        country     = COALESCE(${country ?? null}, country),
        phone       = COALESCE(${phone ?? null}, phone),
        "isDefault" = COALESCE(${isDefault ?? null}, "isDefault")
    WHERE id = ${id}
  `;

  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const owns = await sql`SELECT id FROM "Address" WHERE id = ${id} AND "customerId" = ${session.sub} AND "orderId" IS NULL LIMIT 1`;
  if (owns.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await sql`DELETE FROM "Address" WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
