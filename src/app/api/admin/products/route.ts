import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const { name, brand, price, initialStock } = body;

        if (!name || !brand || typeof price !== "number" || price <= 0) {
            return NextResponse.json(
                {
                    message:
                        "Invalid product data. Name, brand, and price are required.",
                },
                { status: 400 }
            );
        }

        // Create product with quantity directly
        const product = await prisma.product.create({
            data: {
                name,
                brand,
                description: body.description || "",
                price,
                imageUrl: body.imageUrl || "/images/default-cigarette.jpg",
                quantity: initialStock || 0,
                tarContent: body.tarContent || null,
                nicotineContent: body.nicotineContent || null,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { message: "Failed to create product" },
            { status: 500 }
        );
    }
}
