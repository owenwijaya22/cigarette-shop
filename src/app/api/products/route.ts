import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const includeInventory = searchParams.get("includeInventory") === "true";

    try {
        let products;

        if (includeInventory) {
            products = await prisma.product.findMany({
                include: {
                    inventory: true,
                },
            });
        } else {
            products = await prisma.product.findMany();
        }

        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { message: "Failed to fetch products" },
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
