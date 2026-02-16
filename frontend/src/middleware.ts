import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
    PROTECTED_ROUTES,
    AUTH_ROUTES,
    DEFAULT_LOGIN_REDIRECT,
    DEFAULT_AUTH_REDIRECT,
} from "@/constants/routes";

/**
 * Middleware for route protection
 * - Redirects unauthenticated users from protected routes to login
 * - Redirects authenticated users from auth routes to dashboard
 */
export default function middleware(request: NextRequest) {
    // Skip route protection in mock mode (no backend)
    if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
        return NextResponse.next();
    }

    const { pathname } = request.nextUrl;

    // Check for auth token in cookies
    // In production, this would verify JWT validity
    const authToken = request.cookies.get("verbo_access_token")?.value;
    const isAuthenticated = !!authToken;

    // Check if current path is protected
    const isProtectedRoute = PROTECTED_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    // Check if current path is an auth route
    const isAuthRoute = AUTH_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL(DEFAULT_AUTH_REDIRECT, request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users from auth routes
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(
            new URL(DEFAULT_LOGIN_REDIRECT, request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc.)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
    ],
};
