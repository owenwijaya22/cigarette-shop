import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // Fetch all products with their inventory information
        const products = await prisma.product.findMany({
            include: {
                inventory: true,
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Create the product
        const product = await prisma.product.create({
            data: {
                name: data.name,
                brand: data.brand,
                description: data.description,
                price: data.price,
                imageUrl: data.imageUrl,
                // Create inventory at the same time
                inventory: {
                    create: {
                        quantity: data.quantity || 0,
                    },
                },
            },
            include: {
                inventory: true,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        );
    }
}
