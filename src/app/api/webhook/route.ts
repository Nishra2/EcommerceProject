import { NextResponse } from "next/server";
import Stripe from "stripe";
import { buffer } from "node:stream/consumers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  let event;

  try {
    const body = await buffer(req.body as any);
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (err: any) {
    return NextResponse.json(
      { message: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const customerDetails = session.customer_details;
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const totalAmount = session.amount_total / 100;

    try {
      await prisma.order.create({
        data: {
          userId: 1, // TODO: Get the actual user ID
          email: customerDetails?.email || "",
          name: customerDetails?.name || "",
          address: customerDetails?.address?.line1 || "",
          lineItems: JSON.stringify(lineItems.data),
          totalAmount: totalAmount,
        },
      });
      console.log("Payment successful, order saved to database", session);
    } catch (error) {
      console.error("Error saving order to database:", error);
    }
  }

  return NextResponse.json({ received: true });
}
