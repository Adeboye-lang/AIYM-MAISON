import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Maison AIYM <noreply@maisonaiym.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://maisonaiym.com";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { subject, body } = await req.json();
    if (!subject?.trim() || !body?.trim()) {
      return NextResponse.json({ error: "Subject and body are required." }, { status: 400 });
    }

    const subscribers = await sql`
      SELECT id, email, name, "unsubToken" FROM "NewsletterSubscriber" WHERE status = 'active'
    `;

    if (subscribers.length === 0) {
      return NextResponse.json({ error: "No active subscribers to send to." }, { status: 400 });
    }

    // Assign unsubscribe tokens to any subscribers that don't have one
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const needToken = (subscribers as any[]).filter((s) => !s.unsubtoken);
    for (const s of needToken) {
      const token = randomBytes(24).toString("hex");
      await sql`UPDATE "NewsletterSubscriber" SET "unsubToken" = ${token} WHERE id = ${s.id}`;
      s.unsubtoken = token;
    }

    const buildHtml = (unsubUrl: string) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:520px;margin:40px auto;padding:0 16px;">
    <div style="background:#3B1F0E;padding:24px;text-align:center;">
      <p style="color:#C9A84C;font-size:26px;letter-spacing:0.25em;margin:0;">AIYM</p>
      <p style="color:#C9A84C;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;margin:6px 0 0;">Maison AIYM</p>
    </div>
    <div style="background:#fff;padding:36px 32px;border:1px solid #E8D5A3;border-top:none;">
      <div style="color:#6B3A22;font-size:14px;line-height:1.75;">${body.replace(/\n/g, "<br/>")}</div>
      <div style="border-top:1px solid #E8D5A3;margin-top:28px;padding-top:16px;">
        <a href="${APP_URL}" style="display:inline-block;background:#C9A84C;color:#3B1F0E;text-decoration:none;padding:14px 32px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">Shop Now</a>
      </div>
    </div>
    <div style="background:#3B1F0E;padding:14px;text-align:center;">
      <p style="color:#A07850;font-size:10px;margin:0;">© Maison AIYM 2026 · <a href="mailto:support@maisonaiym.com" style="color:#A07850;">support@maisonaiym.com</a></p>
      <p style="margin:6px 0 0;"><a href="${unsubUrl}" style="color:#A07850;font-size:9px;">Unsubscribe</a></p>
    </div>
  </div>
</body></html>`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const batchSize = 100;
    let sent = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const all = subscribers as any[];
    for (let i = 0; i < all.length; i += batchSize) {
      const batch = all.slice(i, i + batchSize);
      await resend.batch.send(
        batch.map((s) => ({
          from: FROM,
          to: s.email as string,
          subject,
          html: buildHtml(`${APP_URL}/newsletter/unsubscribe?token=${s.unsubtoken}`),
        }))
      );
      sent += batch.length;
    }

    return NextResponse.json({ success: true, sent });
  } catch (err) {
    console.error("Newsletter send error:", err);
    const message = err instanceof Error ? err.message : "Failed to send newsletter.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
