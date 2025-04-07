import nodemailer from "nodemailer";

// This would normally come from environment variables
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const GMAIL_RECEIVER = process.env.GMAIL_RECEIVER;
// Create a transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS,
    },
});

/**
 * Send an order notification email
 */
export async function sendOrderNotification(orderDetails: {
    id: string;
    total: number;
    items: { name: string; quantity: number; price: number }[];
    customerEmail: string;
    customerName?: string;
    customerPhone?: string;
    pickupDetails?: string;
}) {
    // Make sure we have email credentials
    if (!GMAIL_USER || !GMAIL_PASS) {
        console.error("Email credentials not configured");
        return;
    }

    const itemsList = orderDetails.items
        .map(
            (item) =>
                `${item.name} - Qty: ${item.quantity} - $${item.price.toFixed(
                    2
                )}`
        )
        .join("<br>");

    const mailOptions = {
        from: GMAIL_USER,
        to: GMAIL_RECEIVER, // Send notification to yourself
        subject: `Order: ${orderDetails.customerName} - Pickup at ${
            orderDetails.pickupDetails?.substring(0, 30) || "Not specified"
        }`,
        html: `
      <h1>Cigarette Order: ${orderDetails.customerName}</h1>
      <h2>Pickup: ${orderDetails.pickupDetails || "Not specified"}</h2>
      <hr style="margin: 20px 0;">
      <p><strong>Order ID:</strong> ${orderDetails.id}</p>
      <p><strong>Customer:</strong> ${orderDetails.customerName || "N/A"}</p>
      ${
          orderDetails.customerPhone
              ? `<p><strong>Phone:</strong> ${orderDetails.customerPhone}</p>`
              : ""
      }
      <p><strong>Email:</strong> ${orderDetails.customerEmail}</p>
      ${
          orderDetails.pickupDetails
              ? `<p><strong>Pickup Details:</strong> ${orderDetails.pickupDetails}</p>`
              : ""
      }
      <h2>Items:</h2>
      <p>${itemsList}</p>
      <p><strong>Total:</strong> $${orderDetails.total.toFixed(2)}</p>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

/**
 * Test function to verify email functionality
 */
export async function testEmailNotification() {
    return await sendOrderNotification({
        id: "TEST-ORDER-123",
        total: 45.99,
        items: [
            { name: "Marlboro Red", quantity: 2, price: 15.99 },
            { name: "Double Happiness", quantity: 1, price: 14.01 },
        ],
        customerEmail: "test@example.com",
        customerName: "Test Customer",
        customerPhone: "+1234567890",
        pickupDetails: "Behind Panfilov Park, 9pm tonight",
    });
}
