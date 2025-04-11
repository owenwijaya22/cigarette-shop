import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Update quantity for a specific product
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const data = await request.json();

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        // Update quantity directly on the product
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: { quantity: data.quantity },
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product quantity:", error);
        return NextResponse.json(
            { error: "Failed to update quantity" },
            { status: 500 }
        );
    }
}