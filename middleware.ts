import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Edge middleware — runs BEFORE any page or API route renders.
 * Protects /admin/* pages and /api/uploads from unauthenticated access.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the JWT from the session cookie
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // ── Protect /admin routes ──
  if (pathname.startsWith("/admin")) {
    // Not logged in at all → send to login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Logged in but not an admin → send to dashboard
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // ── Protect /api/uploads (admin-only) ──
  if (pathname.startsWith("/api/uploads")) {
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/uploads/:path*"],
};
