import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const { productId, quantity } = body;

        if (!productId || typeof quantity !== "number" || quantity < 0) {
            return NextResponse.json(
                {
                    message:
                        "Invalid inventory data. Product ID and quantity (≥ 0) are required.",
                },
                { status: 400 }
            );
        }

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        // Update inventory
        const inventory = await prisma.inventory.upsert({
            where: { productId },
            update: { quantity },
            create: {
                productId,
                quantity,
            },
        });

        return NextResponse.json(inventory);
    } catch (error) {
        console.error("Error updating inventory:", error);
        return NextResponse.json(
            { message: "Failed to update inventory" },
            { status: 500 }
        );
    }
}
