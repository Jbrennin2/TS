import { NextResponse } from "next/server";
import { buffer } from "node:stream/consumers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

export async function POST(req) {
  const rawBody = await buffer(req.body);
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      req.headers.get("stripe-signature") ,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    const id = event.object.metadata.order_id;
    const status = 'paid'

    const query = sql`
      UPDATE orders
      SET status = $1
      WHERE id = $2
    `;
  
    const result = await query(status, id);
  
    if (result.rowCount === 0) {
      return new NextResponse(404, {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Order not found" }),
      });
    }
  
    return new NextResponse(200, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Order status updated successfully" }),
    });


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