import { NextResponse } from "next/server"; // next.js response handling
import Stripe from "stripe"; // stripe library for payment processing

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore: Using a different API version than the latest
  apiVersion: "2024-12-18.acacia",
});
// allow cors for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(req: Request) {
  try {
    const { cartItems } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return new NextResponse("No cart items provided", { status: 400 });
    }

    const line_items = cartItems.map((item: any) => ({
      price_data: {
        currency: "aud",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
            // URLs to redirect to after payment succeeds or is canceled

      success_url: `${req.headers.get("origin")}/success`,
      cancel_url: `${req.headers.get("origin")}/cancel`,
      metadata: {
        userId: req.headers.get("user-id") || "unknown" 
      }
    });

    return NextResponse.json(
      { url: session.url },
      {
        headers: corsHeaders,
      }
    );
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
