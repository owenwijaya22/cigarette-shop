import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendOrderNotification } from "@/lib/email";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: Request) {
    try {
        const orders = await prisma.order.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { message: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { customerName, customerPhone, customerCountry, items, total } =
            body;

        // Validate request data
        if (
            !customerName ||
            !customerPhone ||
            !customerCountry ||
            !items ||
            !total
        ) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        if (!items.length) {
            return NextResponse.json(
                { message: "Order must contain at least one item" },
                { status: 400 }
            );
        }

        // Find the admin user
        const adminUser = await prisma.user.findUnique({
            where: { email: "owenwijaya89@gmail.com" },
        });

        if (!adminUser) {
            return NextResponse.json(
                { message: "Admin user not found" },
                { status: 500 }
            );
        }

        // Verify inventory availability for all products
        for (const item of items) {
            const inventory = await prisma.inventory.findUnique({
                where: { productId: item.productId },
            });

            if (!inventory) {
                return NextResponse.json(
                    {
                        message: `Inventory not found for product ID: ${item.productId}`,
                    },
                    { status: 400 }
                );
            }

            if (inventory.quantity < item.quantity) {
                return NextResponse.json(
                    {
                        message: `Not enough stock for product ID: ${item.productId}. Available: ${inventory.quantity}, Requested: ${item.quantity}`,
                    },
                    { status: 400 }
                );
            }
        }

        // Use a transaction to ensure both order creation and inventory update succeed or fail together
        const result = await prisma.$transaction(async (tx) => {
            // Generate a new UUID for the order
            const orderId = uuidv4();
            const now = new Date().toISOString();

            // Create the order
            await tx.$executeRaw`
                INSERT INTO "Order" (
                    "id", 
                    "userId", 
                    "customerName", 
                    "customerPhone", 
                    "customerCountry", 
                    "total", 
                    "status", 
                    "createdAt", 
                    "updatedAt"
                ) VALUES (
                    ${orderId}::uuid,
                    ${adminUser.id}::uuid,
                    ${customerName}::text,
                    ${customerPhone}::text,
                    ${customerCountry}::text,
                    ${total}::decimal,
                    'PENDING'::"OrderStatus",
                    NOW(),
                    NOW()
                )
            `;

            // Create order items and update inventory
            for (const item of items) {
                // Create order item
                await tx.orderItem.create({
                    data: {
                        orderId,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    },
                });

                // Update inventory by decreasing the quantity
                await tx.inventory.update({
                    where: { productId: item.productId },
                    data: {
                        quantity: { decrement: item.quantity },
                        updatedAt: new Date(),
                    },
                });
            }

            // Fetch the complete order with items and product details
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            // Create necessary analytics data
            if (order) {
                // Create order analytics
                await tx.orderAnalytics.create({
                    data: {
                        orderId: order.id,
                        country: order.customerCountry,
                        orderDate: order.createdAt,
                        totalAmount: order.total,
                        productCount: order.orderItems.reduce(
                            (acc, item) => acc + item.quantity,
                            0
                        ),
                    },
                });

                // Create product analytics for each ordered item
                for (const item of order.orderItems) {
                    await tx.productAnalytics.create({
                        data: {
                            productId: item.productId,
                            country: order.customerCountry,
                            quantity: item.quantity,
                            orderDate: order.createdAt,
                        },
                    });
                }
            }

            return order;
        });

        // Send email notification outside of transaction
        if (result) {
            const emailData = {
                id: result.id,
                total: result.total,
                items: result.orderItems.map((item) => ({
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
                customerEmail: adminUser.email,
                customerName: result.customerName,
                customerPhone: result.customerPhone,
            };

            // Send email notification
            await sendOrderNotification(emailData);
        }

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { message: "Internal server error", error: String(error) },
            { status: 500 }
        );
    }
}
