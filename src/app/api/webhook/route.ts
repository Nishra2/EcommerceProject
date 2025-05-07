import { NextResponse } from "next/server";
import Stripe from "stripe";
import { buffer } from "node:stream/consumers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore: Using a different API version than the latest
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
    
    
    const userId = session.metadata?.userId;
    
    
    const customerDetails = session.customer_details;
    
    
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
   
    const totalAmount = session.amount_total / 100;
    
  
    try {
      const orderData = {
        userId: userId ? parseInt(userId) : null,
        email: customerDetails?.email || "",
        name: customerDetails?.name || "",
        address: customerDetails?.address?.line1 || "",
        lineItems: JSON.stringify(lineItems.data),
        totalAmount: totalAmount,
      };
      
      
      
      const createdOrder = await prisma.order.create({
        data: orderData
      });
      
 
    } catch (error) {
      console.error("Detailed error saving order to database:", error);
      
      if (error.stack) console.error(error.stack);
    }
  }

  return NextResponse.json({ received: true });
}
