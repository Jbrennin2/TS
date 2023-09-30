import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log('hit');

  if (request.headers.get('content-type') !== 'application/json') {
    return NextResponse.json({ error: 'Expected application/json' }, { status: 400 });
  }

  const parsedObject = await request.json();
  console.log(parsedObject);
  
  const {
    firstName, 
    lastName, 
    email, 
    address1, 
    phone, 
    city, 
    state,
    zipCode, 
    province, 
    provinceCode, 
    country, 
    address2, 
    company, 
    countryCode, 
    quantity, 
    lineItemPrintUrl
  } = parsedObject; 

  const price = "30.00"

  try {
    if (!email || !quantity || !firstName || !lastName || !address1 || !city || !zipCode || !countryCode || !lineItemPrintUrl) throw new Error('Missing required fields');
    await sql`INSERT INTO Orders (Firstname, Lastname, Email, Address1, Phone, City, State, Zipcode, Province, Province_code, Address2, Company, Country, Country_code, Quantity, Price, Line_item_print_url) VALUES (
        ${firstName}, ${lastName}, 
        ${email}, ${address1}, ${phone}, 
        ${city}, ${state}, ${zipCode}, ${province}, 
        ${provinceCode}, ${address2}, 
        ${company}, ${country}, ${countryCode},
        ${quantity}, ${price}, ${lineItemPrintUrl});`;
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error }, { status: 500 });
  }
 
  const order = await sql`SELECT * FROM Orders;`;
  return NextResponse.json({ order }, { status: 200 });
}