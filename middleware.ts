import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "aiym-super-secret-jwt-key-change-in-production-2026"
);

const ADMIN_SUBDOMAIN = "admin.maisonaiym.com";
const MAIN_DOMAIN = "maisonaiym.com";

async function getSession(token: string | undefined): Promise<{ role?: string } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { role?: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";
  const token = request.cookies.get("aiym-session")?.value;
  const session = await getSession(token);

  const isAuthenticated = !!session;
  const isAdmin = session?.role === "admin";

  // ── Subdomain routing ──────────────────────────────────────────────────────
  const isAdminSubdomain = host === ADMIN_SUBDOMAIN || host.startsWith("admin.");
  const isMainDomain = host === MAIN_DOMAIN || host === `www.${MAIN_DOMAIN}`;

  // On the main domain, block /admin paths — redirect to the admin subdomain
  if (isMainDomain && pathname.startsWith("/admin")) {
    const adminUrl = `https://${ADMIN_SUBDOMAIN}${pathname.replace(/^\/admin/, "") || "/"}`;
    return NextResponse.redirect(adminUrl);
  }

  // On the admin subdomain, rewrite root → /admin, /orders → /admin/orders, etc.
  if (isAdminSubdomain) {
    // Skip Next.js internals, API routes, auth pages, and static files
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/auth") ||
      pathname.startsWith("/images") ||
      pathname.startsWith("/fonts") ||
      pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|css|js|woff2?)$/)
    ) {
      return NextResponse.next();
    }

    // Require admin session
    if (!isAdmin) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Rewrite: admin.maisonaiym.com/orders → /admin/orders
    if (!pathname.startsWith("/admin")) {
      const rewritten = request.nextUrl.clone();
      rewritten.pathname = `/admin${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(rewritten);
    }

    return NextResponse.next();
  }

  // ── Standard auth guards (main domain / localhost) ─────────────────────────
  if (pathname.startsWith("/account") && !isAuthenticated) {
    return NextResponse.redirect(
      new URL("/auth/login?next=" + encodeURIComponent(pathname), request.url)
    );
  }

  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(
      new URL("/auth/login?next=" + encodeURIComponent(pathname), request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/admin/:path*",
    // Also run on the admin subdomain for all paths
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
