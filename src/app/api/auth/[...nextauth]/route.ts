import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) {
                    return null;
                }

                const isPasswordValid = await verifyPassword(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    isAdmin: user.isAdmin,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT; user: any }) {
            if (user) {
                token.id = user.id;
                token.isAdmin = Boolean(user.isAdmin);
                console.log("JWT callback - Adding user data to token:", {
                    userId: user.id,
                    isAdmin: user.isAdmin,
                    tokenIsAdmin: token.isAdmin,
                });
            }
            return token;
        },
        async session({ session, token }: { session: any; token: JWT }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.isAdmin = Boolean(token.isAdmin);
                console.log(
                    "Session callback - Setting user data in session:",
                    {
                        userId: token.id,
                        isAdmin: token.isAdmin,
                        sessionUserIsAdmin: session.user.isAdmin,
                    }
                );
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/logout",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt" as const,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
