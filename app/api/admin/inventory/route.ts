import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const products = await sql`SELECT id, name, "stockCount", "lowStockAt", "inStock" FROM "Product"`;
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { productId, action, units, reason } = await req.json();
  if (!productId || !action || !units || !reason) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const delta = action === "add" ? parseInt(units) : -parseInt(units);

  const [product] = await sql`
    UPDATE "Product"
    SET "stockCount" = GREATEST(0, "stockCount" + ${delta}),
        "updatedAt" = NOW()
    WHERE id = ${productId}
    RETURNING "stockCount"
  `;

  await sql`
    INSERT INTO "StockLog" (id, "productId", change, reason, "adminUser", "resultingTotal", "createdAt")
    VALUES (${randomUUID()}, ${productId}, ${delta}, ${reason}, ${session.firstName + ' ' + session.lastName}, ${product.stockCount}, NOW())
  `;

  return NextResponse.json({ success: true, stockCount: product.stockCount });
}
