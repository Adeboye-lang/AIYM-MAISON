import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import sql from "@/lib/db";
import { generateToken } from "@/lib/auth-helpers";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await req.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Check if email already exists
    const existing = await sql`SELECT id FROM "Customer" WHERE email = ${email.toLowerCase()}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const verifyToken = generateToken();
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await sql`
      INSERT INTO "Customer" (id, email, "firstName", "lastName", "passwordHash", "emailVerified", "verifyToken", "verifyTokenExpiry", role)
      VALUES (
        ${randomUUID()},
        ${email.toLowerCase()},
        ${firstName},
        ${lastName},
        ${passwordHash},
        false,
        ${verifyToken},
        ${verifyTokenExpiry.toISOString()},
        'customer'
      )
    `;

    // Send verification email — if Gmail not configured, logs to console in dev
    try {
      await sendVerificationEmail(email.toLowerCase(), verifyToken);
    } catch (emailErr) {
      console.warn("Email send failed:", emailErr);
    }

    // In dev mode without Gmail, return the verify link so the page can show it
    const isDev = process.env.NODE_ENV !== "production";
    const noEmail = !process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD
      || process.env.GMAIL_USER === "your-gmail@gmail.com";

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const devLink = (isDev && noEmail)
      ? `${appUrl}/api/auth/verify-email?token=${verifyToken}`
      : null;

    return NextResponse.json({ success: true, devVerifyLink: devLink });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
