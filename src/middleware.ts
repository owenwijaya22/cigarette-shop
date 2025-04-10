import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if path starts with /admin or /api/admin
  const isAdminRoute = path.startsWith('/admin') || path.startsWith('/api/admin');
  
  // If it's not an admin route, continue
  if (!isAdminRoute) {
    return NextResponse.next();
  }
  
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check if the user is authenticated and is an admin
  const isAuthenticated = !!token;
  const isAdmin = token?.role === 'ADMIN';

  if (isAdminRoute && (!isAuthenticated || !isAdmin)) {
    // If it's an API route, return 401
    if (path.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Use NextAuth's default signin page
    const signInUrl = new URL("/api/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ]
};
