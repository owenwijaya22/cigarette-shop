import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// Simple password hashing function directly in the seed file
async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

const prisma = new PrismaClient();

async function main() {
    console.log("Starting seed...");

    // Create admin user
    const adminPassword = await hashPassword("admin123");
    const admin = await prisma.user.upsert({
        where: { email: "owenwijaya89@gmail.com" },
        update: {},
        create: {
            email: "owenwijaya89@gmail.com",
            name: "Admin User",
            password: adminPassword,
            isAdmin: true,
        },
    });

    console.log("Created admin user:", admin.email);

    // Create guest user for guest checkout
    const guestPassword = await hashPassword("guest123");
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

    console.log("Created guest user:", guest.email);

    // Sample cigarette brands and products
    const cigaretteProducts = [
        {
            name: "Marlboro Red",
            brand: "Marlboro",
            description: "Classic full-flavored cigarettes with a rich taste.",
            price: 55,
            imageUrl: "/images/cigarettes/marlborored.jpg",
            quantity: 100,
        },
        {
            name: "Double Happiness",
            brand: "Double Happiness",
            description:
                "Traditional Chinese cigarettes with a distinctive red package and double happiness symbol.",
            price: 55,
            imageUrl: "/images/cigarettes/doublehappiness.jpg",
            quantity: 55,
        },
    ];

    // Create products with inventory
    for (const product of cigaretteProducts) {
        const { quantity, ...productData } = product;

        const createdProduct = await prisma.product.create({
            data: {
                ...productData,
                inventory: {
                    create: {
                        quantity,
                    },
                },
            },
        });

        console.log(`Created product: ${createdProduct.name}`);
    }

    console.log("Seed completed successfully!");
}

main()
    .catch((e) => {
        console.error("Error during seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
