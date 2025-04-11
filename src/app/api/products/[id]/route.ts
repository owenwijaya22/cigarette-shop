import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


// Get a specific product
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } =  await params;

        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { error: "Failed to fetch product" },
            { status: 500 }
        );
    }
}

// Update a product
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } =  await params;
        const data = await request.json();

        const product = await prisma.product.update({
            where: { id },
            data: {
                name: data.name,
                brand: data.brand,
                description: data.description,
                price: data.price,
                imageUrl: data.imageUrl,
                quantity: data.quantity,
                tarContent: data.tarContent,
                nicotineContent: data.nicotineContent,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 }
        );
    }
}

// Delete a product
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        // Delete the product (this will cascade to inventory due to our model definition)
        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json(
            { error: "Failed to delete product" },
            { status: 500 }
        );
    }
}
