import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Verify a request is authenticated as an admin
 * Use this in API routes that need admin protection
 */
export async function verifyAdminRequest(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return null; // No error, proceed
}

/**
 * Verify a request is authenticated (any user)
 * Use this in API routes that need user authentication
 */
export async function verifyAuthRequest(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return null; // No error, proceed
}
