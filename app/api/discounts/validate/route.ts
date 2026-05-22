import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  const { code, subtotal } = await req.json();

  if (!code) return NextResponse.json({ error: "No code provided" }, { status: 400 });

  const rows = await sql`
    SELECT * FROM "DiscountCode"
    WHERE code = ${code.toUpperCase()} AND active = true
    AND ("expiresAt" IS NULL OR "expiresAt" > NOW())
    AND ("maxUses" IS NULL OR uses < "maxUses")
    LIMIT 1
  `;

  if (rows.length === 0) return NextResponse.json({ error: "Invalid or expired code" }, { status: 404 });

  const dc = rows[0] as { id: string; code: string; type: string; value: number; minorder: number };

  if (subtotal < dc.minorder) {
    return NextResponse.json({ error: `Minimum order of £${dc.minorder.toFixed(2)} required` }, { status: 422 });
  }

  const discount = dc.type === "percentage"
    ? (subtotal * dc.value) / 100
    : Math.min(dc.value, subtotal);

  return NextResponse.json({
    id: dc.id,
    code: dc.code,
    type: dc.type,
    value: dc.value,
    discount: Math.round(discount * 100) / 100,
  });
}
