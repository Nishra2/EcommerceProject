import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore: Using a different API version than the latest
  apiVersion: "2024-12-18.acacia",
});

// function that calculates the total amount from the cart items
const calculateOrderAmount = (items) => {
  
  let total = 0;
  items.forEach((item) => {
    total += item.amount;
  });
  return total;
};

// Define the API endpoint handler for POST requests

export async function POST(req: Request) {
    // Extract the items array from the incoming request body

  const { items } = await req.json();

    // Create a payment intent in Stripe 

  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "aud",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
