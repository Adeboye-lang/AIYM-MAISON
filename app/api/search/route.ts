import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json({ products: [], pages: [] });

  const products = await sql`
    SELECT id, name, price, images, "variantKey"
    FROM "Product"
    WHERE name ILIKE ${"%" + q + "%"} OR description ILIKE ${"%" + q + "%"}
    LIMIT 8
  `;

  const staticPages = [
    { title: "How To Use", href: "/#how-to-use" },
    { title: "Our Story", href: "/#story" },
    { title: "FAQs", href: "/faqs" },
    { title: "Reviews", href: "/#reviews" },
  ].filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));

  return NextResponse.json({ products, pages: staticPages });
}
