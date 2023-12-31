import Stripe from "stripe";
import { NextResponse } from 'next/server';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {

  const data = await req.json();

  if (req.method === "POST") {
    try {
  const session = await stripe.checkout.sessions.create({
    success_url: 'https://ts-beige.vercel.app/success',
    line_items: [
      {price: "price_1NwBImLSbyqQ9JQPRkK9ufLz", quantity: 1},
    ],
    mode: 'payment',
    metadata: {'order_id': data.orderId},
  });
      console.log(session.id)
      return NextResponse.json({ sessionId: session.id }, { status: 200 });

    } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}