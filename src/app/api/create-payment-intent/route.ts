import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore: Using a different API version than the latest
  apiVersion: "2024-12-18.acacia",
});

const calculateOrderAmount = (items) => {
  
  let total = 0;
  items.forEach((item) => {
    total += item.amount;
  });
  return total;
};

export async function POST(req: Request) {
  const { items } = await req.json();

  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "aud",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
