import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge middleware untuk Sinaptex.
 * - Redirect user yang sudah login dari /login dan /register ke /dashboard
 * - Redirect user yang belum login dari area terproteksi ke /login
 * - Menambahkan security headers
 */

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/opportunities",
  "/chat",
  "/deals",
  "/membership",
  "/profile",
  "/notifications",
  "/matching",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cek session dari cookie Supabase (sb-access-token)
  const sessionCookie = request.cookies.get("sb-access-token")?.value;
  const hasSession = Boolean(sessionCookie);

  // 1. Redirect authenticated user away from auth pages
  if (hasSession && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. Redirect unauthenticated user from protected routes
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (!hasSession && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Add security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.json|icons/).*)",
  ],
};