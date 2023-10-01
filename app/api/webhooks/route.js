import { NextResponse } from "next/server";
import { buffer } from "node:stream/consumers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

export async function POST(req) {
  console.log()
  const rawBody = await buffer(req.body);
  console.log('got body')
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      req.headers.get("stripe-signature") ,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "Webhook signature verification failed",
      },
      {
        status: 400,
      }
    );
  }
  return NextResponse.json(
    { message: "successfully received" },
    { status: 200 }
  );
}