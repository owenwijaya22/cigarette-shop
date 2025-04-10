import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // Check if the path starts with /admin
    if (request.nextUrl.pathname.startsWith("/admin")) {
        // If no token or user is not an admin, redirect to login
        if (!token || !token.isAdmin) {
            const loginUrl = new URL("/auth/login", request.url);
            loginUrl.searchParams.set("callbackUrl", request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

// Specify which paths the middleware should run on
export const config = {
    matcher: ["/admin/:path*"],
};
