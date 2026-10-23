import { NextResponse, type NextRequest } from "next/server";

// Optimistic navigation check. Server layouts and Express verify the session and role.
export function proxy(request: NextRequest) {
  const cookies = request.cookies;
  const hasSession =
    cookies.has("betterAuthSession") ||
    cookies.has("better-auth.session_token") ||
    cookies.has("__Secure-better-auth.session_token");
  if (!cookies.has("accessToken") || !hasSession) {
    const url = new URL("/signin", request.url);
    url.searchParams.set(
      "next",
      request.nextUrl.pathname + request.nextUrl.search,
    );
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
