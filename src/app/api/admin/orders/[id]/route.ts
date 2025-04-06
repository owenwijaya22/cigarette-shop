import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const orderId = params.id;
        const { status } = await request.json();

        // Validate status
        const validStatuses = [
            "PENDING",
            "PAID",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
        ];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { message: "Invalid order status" },
                { status: 400 }
            );
        }

        // Check if order exists
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            return NextResponse.json(
                { message: "Order not found" },
                { status: 404 }
            );
        }

        // Update order status
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Error updating order status:", error);
        return NextResponse.json(
            { message: "Failed to update order status" },
            { status: 500 }
        );
    }
}
