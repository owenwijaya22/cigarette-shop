import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

async function createAdminUser() {
    const prisma = new PrismaClient();
    try {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        const user = await prisma.user.upsert({
            where: { email: "admin@example.com" },
            update: {},
            create: {
                email: "admin@example.com",
                name: "Admin User",
                password: hashedPassword,
                isAdmin: true,
            },
        });
        console.log("Created or found admin user:", user);

        // Also create a guest user
        const guestPassword = await bcrypt.hash("guest123", 10);
        const guest = await prisma.user.upsert({
            where: { email: "guest@example.com" },
            update: {},
            create: {
                email: "guest@example.com",
                name: "Guest User",
                password: guestPassword,
                isAdmin: false,
            },
        });
        console.log("Created or found guest user:", guest);
    } catch (error) {
        console.error("Error creating users:", error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser();
