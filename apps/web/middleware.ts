import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// This middleware will run on specified paths
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path should be protected
  // Add any routes here that should be public
  const isPublicPath =
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/api/auth/") ||
    pathname === "/";

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check if the user is authenticated
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If no token exists, redirect to the sign-in page
  if (!token) {
    const signInUrl = new URL("/auth/signin", request.url);

    // Add the current path as callback URL to redirect back after sign-in
    signInUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(signInUrl);
  }

  // For routes that require an organization
  if (!token.organizationId && !pathname.startsWith("/auth/no-organization")) {
    return NextResponse.redirect(new URL("/auth/no-organization", request.url));
  }

  return NextResponse.next();
}

// Configure which paths should trigger this middleware
export const config = {
  matcher: [
    // Match all paths except these:
    // - Static files (underscore prefix in Next.js)
    // - API routes that don't need auth
    // - Auth routes (handled in the middleware itself)
    // - Root (home) page
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
