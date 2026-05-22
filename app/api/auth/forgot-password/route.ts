import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { generateToken } from "@/lib/auth-helpers";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const rows = await sql`SELECT id, email FROM "Customer" WHERE email = ${email.toLowerCase()} LIMIT 1`;

    // Always return success to prevent email enumeration
    if (rows.length === 0) {
      return NextResponse.json({ success: true });
    }

    const user = rows[0];
    const resetToken = generateToken();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await sql`
      UPDATE "Customer"
      SET "resetToken" = ${resetToken}, "resetTokenExpiry" = ${resetTokenExpiry.toISOString()}
      WHERE id = ${user.id}
    `;

    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (emailErr) {
      console.warn("Reset email send failed:", emailErr);
    }

    // Dev mode: return the reset link directly when no Gmail configured
    const isDev = process.env.NODE_ENV !== "production";
    const noEmail = !process.env.GMAIL_USER || process.env.GMAIL_USER === "your-gmail@gmail.com";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const devResetLink = (isDev && noEmail)
      ? `${appUrl}/auth/reset-password?token=${resetToken}`
      : null;

    return NextResponse.json({ success: true, devResetLink });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
