import { NextResponse } from "next/server";
import { buffer } from "node:stream/consumers";

export async function POST(req) {
  console.log('hit POST')
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
 // have to return response promptly, ie without waiting for back-end process or stripe will potentially flag your account
  handleWebhook(event);
  return NextResponse.json(
    { message: "successfully received" },
    { status: 200 }
  );
}