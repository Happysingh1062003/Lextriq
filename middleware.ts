import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("authjs.session-token")?.value ||
        request.cookies.get("__Secure-authjs.session-token")?.value;

    // Protect dashboard routes
    if (pathname.startsWith("/dashboard")) {
        if (!token) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Redirect authenticated users away from auth pages
    if (pathname === "/login" || pathname === "/signup") {
        if (token) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/signup"],
};
