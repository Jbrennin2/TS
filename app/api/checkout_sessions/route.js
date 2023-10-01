import Stripe from "stripe";
import { NextResponse } from 'next/server';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function POST(request) {
  if (req.method === "POST") {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Sample Product",
              },
              unit_amount: 1000,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/`,
      });
      return NextResponse.json({ sessionId: session.id }, { status: 200 });

    } catch (err) {
    return NextResponse.json({ error }, { status: 500 });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}