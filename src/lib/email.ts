import nodemailer from "nodemailer";

// This would normally come from environment variables
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

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
        to: GMAIL_USER, // Send notification to yourself
        subject: `New Order #${orderDetails.id}`,
        html: `
      <h1>New Cigarette Order</h1>
      <p><strong>Order ID:</strong> ${orderDetails.id}</p>
      <p><strong>Customer:</strong> ${orderDetails.customerName || "N/A"}</p>
      <p><strong>Email:</strong> ${orderDetails.customerEmail}</p>
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
