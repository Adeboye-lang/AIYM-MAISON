import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Maison AIYM <noreply@maisonaiym.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function brandedHtml(title: string, body: string, ctaLink: string, ctaText: string) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:520px;margin:40px auto;padding:0 16px;">
    <div style="background:#3B1F0E;padding:24px;text-align:center;">
      <p style="color:#C9A84C;font-size:26px;letter-spacing:0.25em;margin:0;">AIYM</p>
      <p style="color:#C9A84C;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;margin:6px 0 0;">Maison AIYM</p>
    </div>
    <div style="background:#fff;padding:36px 32px;border:1px solid #E8D5A3;border-top:none;">
      <h2 style="color:#3B1F0E;font-size:20px;font-weight:normal;margin:0 0 12px;">${title}</h2>
      <div style="border-top:1px solid #C9A84C;margin-bottom:20px;"></div>
      <p style="color:#6B3A22;font-size:14px;line-height:1.75;margin:0 0 28px;">${body}</p>
      <a href="${ctaLink}" style="display:inline-block;background:#C9A84C;color:#3B1F0E;text-decoration:none;padding:14px 32px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">${ctaText}</a>
      <p style="color:#A07850;font-size:11px;margin:24px 0 0;">Or copy this link:<br/><span style="color:#6B3A22;word-break:break-all;">${ctaLink}</span></p>
    </div>
    <div style="background:#3B1F0E;padding:14px;text-align:center;">
      <p style="color:#A07850;font-size:10px;margin:0;">© AIYM 2026 · support@maisonaiym.com</p>
    </div>
  </div>
</body></html>`;
}

async function send(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith("re_placeholder")) {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📧  EMAIL (dev — add RESEND_API_KEY to .env.local)`);
    console.log(`To: ${to} | Subject: ${subject}`);
    const match = html.match(/href="(https?:\/\/[^"]+)"/);
    if (match) console.log(`Link: ${match[1]}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    return;
  }
  await resend.emails.send({ from: FROM, to, subject, html });
}

export async function sendVerificationEmail(email: string, token: string) {
  const link = `${APP_URL}/api/auth/verify-email?token=${token}`;
  await send(email, "Verify your AIYM account",
    brandedHtml("Verify your email",
      "Click below to verify your email and activate your account. This link expires in <strong>24 hours</strong>.",
      link, "Verify My Email"));
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const link = `${APP_URL}/auth/reset-password?token=${token}`;
  await send(email, "Reset your AIYM password",
    brandedHtml("Reset your password",
      "Click below to choose a new password. This link expires in <strong>1 hour</strong>. Didn't request this? You can ignore this email.",
      link, "Reset Password"));
}

export async function sendAdminNewOrderEmail(orderId: string, customerEmail: string, total: number, itemsSummary: string) {
  const link = `https://admin.maisonaiym.com/orders/${orderId}`;
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@maisonaiym.com";
  await send(adminEmail, `New Order — £${total.toFixed(2)}`,
    brandedHtml("New order received",
      `A new order of <strong>£${total.toFixed(2)}</strong> has been placed by <strong>${customerEmail}</strong>.<br/><br/>${itemsSummary}`,
      link, "View Order"));
}

export async function sendOrderConfirmationEmail(email: string, orderId: string, total: number, itemsSummary: string) {
  const link = `${APP_URL}/account/orders`;
  await send(email, "Your AIYM order is confirmed",
    brandedHtml("Order confirmed ✓",
      `Thank you for your order! We're preparing your Nubian Velvet now.<br/><br/>${itemsSummary}<br/><br/><strong>Order total: £${total.toFixed(2)}</strong><br/>Order ref: <strong>#${orderId.slice(0, 8).toUpperCase()}</strong>`,
      link, "View My Orders"));
}

export async function sendTrackingEmail(email: string, orderId: string, trackingNumber: string) {
  const link = `${APP_URL}/account/orders`;
  await send(email, "Your AIYM order is on its way!",
    brandedHtml("Your order has been dispatched",
      `Great news — your Nubian Velvet is on its way!<br/><br/>Tracking number: <strong>${trackingNumber}</strong><br/>Order ref: <strong>#${orderId.slice(0, 8).toUpperCase()}</strong><br/><br/>Please allow 1–2 business days for tracking to update.`,
      link, "View My Orders"));
}

export async function sendRefundEmail(email: string, orderId: string, refundAmt: number) {
  const link = `${APP_URL}/account/orders`;
  await send(email, "Your AIYM refund has been issued",
    brandedHtml("Refund issued",
      `Your refund of <strong>£${refundAmt.toFixed(2)}</strong> for order <strong>#${orderId.slice(0, 8).toUpperCase()}</strong> has been processed.<br/><br/>Please allow 5–10 business days for the amount to appear on your statement.`,
      link, "View My Orders"));
}

export async function sendReviewRequestEmail(email: string, firstName: string, orderId: string) {
  const link = `${APP_URL}/#reviews`;
  await send(email, "How's your glow? Leave us a review ✨",
    brandedHtml(`How's your glow, ${firstName || "gorgeous"}?`,
      `We hope you're loving your Nubian Velvet! Your feedback means the world to us and helps other melanin beauties find their perfect tan.<br/><br/>Order ref: <strong>#${orderId.slice(0, 8).toUpperCase()}</strong>`,
      link, "Leave a Review"));
}
