import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { signToken, sessionCookieOptions } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/auth/verify-email?error=missing", req.url));
  }

  const rows = await sql`
    SELECT * FROM "Customer"
    WHERE "verifyToken" = ${token}
      AND "verifyTokenExpiry" > NOW()
    LIMIT 1
  `;

  if (rows.length === 0) {
    return NextResponse.redirect(new URL("/auth/verify-email?error=invalid", req.url));
  }

  const user = rows[0];

  await sql`
    UPDATE "Customer"
    SET "emailVerified" = true, "verifyToken" = NULL, "verifyTokenExpiry" = NULL
    WHERE id = ${user.id}
  `;

  // Auto-sign them in after verifying
  const jwtToken = await signToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    emailVerified: true,
  });

  const res = NextResponse.redirect(new URL("/account/dashboard?verified=1", req.url));
  res.cookies.set(sessionCookieOptions(jwtToken));
  return res;
}
