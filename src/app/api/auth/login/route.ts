import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { email, password } = data;

        // Find the user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 400 }
            );
        }

        // Verify password
        const isPasswordValid = await verifyPassword(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 400 }
            );
        }

        // Rename 'password' from user to avoid conflict
        const { password: userPassword, ...userWithoutPassword } = user;

        return NextResponse.json({
            user: userWithoutPassword,
            message: "Login successful",
        });
    } catch (error) {
        console.error("Error logging in:", error);
        return NextResponse.json(
            { error: "Failed to log in" },
            { status: 500 }
        );
    }
}
