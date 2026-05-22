import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import sql from "@/lib/db";

// POST /api/admin/seed — creates the admin user if one doesn't already exist.
// Call this once from your terminal: curl -X POST http://localhost:3000/api/admin/seed
export async function POST() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return NextResponse.json({ error: "ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local" }, { status: 400 });
  }

  const existing = await sql`SELECT id FROM "Customer" WHERE email = ${email.toLowerCase()} LIMIT 1`;
  if (existing.length > 0) {
    return NextResponse.json({ message: "Admin user already exists.", email });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await sql`
    INSERT INTO "Customer" (id, email, "firstName", "lastName", "passwordHash", "emailVerified", role)
    VALUES (${randomUUID()}, ${email.toLowerCase()}, 'Admin', 'AIYM', ${passwordHash}, true, 'admin')
  `;

  return NextResponse.json({ success: true, message: `Admin created: ${email}` });
}
