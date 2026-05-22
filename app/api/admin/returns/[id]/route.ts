import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { status, refundAmt, adminNotes } = await req.json();

  await sql`
    UPDATE "Return"
    SET status = COALESCE(${status ?? null}, status),
        "refundAmt" = COALESCE(${refundAmt ?? null}, "refundAmt"),
        "adminNotes" = COALESCE(${adminNotes ?? null}, "adminNotes"),
        "updatedAt" = NOW()
    WHERE id = ${id}
  `;

  return NextResponse.json({ success: true });
}
