import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await sql`
    SELECT id, "firstName", "lastName", line1, line2, city, postcode, country, phone, "isDefault"
    FROM "Address"
    WHERE "customerId" = ${session.sub} AND "orderId" IS NULL
    ORDER BY "isDefault" DESC, id ASC
  `;
  return NextResponse.json({ addresses: rows });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { firstName, lastName, line1, line2, city, postcode, country, phone, isDefault } = await req.json();

  if (!firstName || !lastName || !line1 || !city || !postcode) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (isDefault) {
    await sql`UPDATE "Address" SET "isDefault" = false WHERE "customerId" = ${session.sub} AND "orderId" IS NULL`;
  }

  const id = randomUUID();
  await sql`
    INSERT INTO "Address" (id, "customerId", "firstName", "lastName", line1, line2, city, postcode, country, phone, "isDefault")
    VALUES (${id}, ${session.sub}, ${firstName}, ${lastName}, ${line1}, ${line2 ?? null}, ${city}, ${postcode}, ${country ?? "GB"}, ${phone ?? ""}, ${isDefault ?? false})
  `;

  return NextResponse.json({ id }, { status: 201 });
}
