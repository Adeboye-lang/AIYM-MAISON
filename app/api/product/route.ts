import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

export async function GET() {
  const variants = await sql`
    SELECT id, name, "variantKey", price, "stockCount", "inStock", images
    FROM "Product"
    WHERE "variantKey" IS NOT NULL
    ORDER BY "variantKey"
  `;
  return NextResponse.json({ variants });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { variantKey, price, image } = await req.json();
  if (!variantKey) return NextResponse.json({ error: "variantKey required." }, { status: 400 });

  if (price !== undefined) {
    await sql`
      UPDATE "Product"
      SET price = ${price}, "updatedAt" = NOW()
      WHERE "variantKey" = ${variantKey}
    `;
  }
  if (image !== undefined) {
    await sql`
      UPDATE "Product"
      SET images = ${[image]}, "updatedAt" = NOW()
      WHERE "variantKey" = ${variantKey}
    `;
  }

  return NextResponse.json({ success: true });
}
