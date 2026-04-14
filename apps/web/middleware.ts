import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
];

const AUTH_ROUTES = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // feedback submission is always public
    if (pathname.startsWith("/feedback/")) return NextResponse.next();

    // invite accept is always public
    if (pathname.startsWith("/invite/")) return NextResponse.next();

    const hasRefreshToken = req.cookies.has("refreshToken");

    const isPublic = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r));
    const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r));

    // authenticated user hitting auth pages → redirect to dashboard
    if (hasRefreshToken && isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // unauthenticated user hitting protected route → redirect to login
    if (!hasRefreshToken && !isPublic) {
        const loginUrl = new URL("/auth/login", req.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};