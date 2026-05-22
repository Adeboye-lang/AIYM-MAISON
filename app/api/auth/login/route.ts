import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sql from "@/lib/db";
import { signToken, sessionCookieOptions } from "@/lib/auth-helpers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const rows = await sql`SELECT * FROM "Customer" WHERE email = ${email.toLowerCase()} LIMIT 1`;
    const user = rows[0];

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Please verify your email before signing in. Check your inbox.", code: "EMAIL_NOT_VERIFIED" },
        { status: 403 }
      );
    }

    const token = await signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      emailVerified: user.emailVerified,
    });

    const res = NextResponse.json({ success: true, role: user.role });
    res.cookies.set(sessionCookieOptions(token));
    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
