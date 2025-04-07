import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get inventory for a specific product
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const inventory = await prisma.inventory.findUnique({
            where: { productId: id },
            include: { product: true },
        });

        if (!inventory) {
            return NextResponse.json(
                { error: "Inventory not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(inventory);
    } catch (error) {
        console.error("Error fetching inventory:", error);
        return NextResponse.json(
            { error: "Failed to fetch inventory" },
            { status: 500 }
        );
    }
}

// Update inventory for a specific product
export async function PATCH(request: Request, { params } : { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const data = await request.json();

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id },
            include: { inventory: true },
        });

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        // Update inventory or create if it doesn't exist
        const updatedInventory = await prisma.inventory.upsert({
            where: { productId: id },
            update: { quantity: data.quantity },
            create: {
                productId: id,
                quantity: data.quantity,
            },
        });

        return NextResponse.json(updatedInventory);
    } catch (error) {
        console.error("Error updating inventory:", error);
        return NextResponse.json(
            { error: "Failed to update inventory" },
            { status: 500 }
        );
    }
}
