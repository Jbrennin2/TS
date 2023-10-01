import Stripe from 'stripe';
import { buffer } from 'micro';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;


export async function POST(req) {
  console.log('WEBHOOK HIT')
  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
    console.log('hit try')
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json(`Webhook signature verification failed: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log(`Payment successful for session ID: ${session.id}`);
      break;

    // Add other event types to handle as needed

    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  NextResponse.json('done')
}

