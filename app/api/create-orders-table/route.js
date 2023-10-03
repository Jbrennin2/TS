import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request) {
  try {
    const result =
      await sql`CREATE TABLE Orders ( 
        id SERIAL PRIMARY KEY, 
        firstname varchar(255), 
        lastname varchar(255),
        email varchar(255), 
        address1 varchar(255), 
        phone varchar(255), 
        city varchar(255), 
        state varchar(255), 
        zipcode integer,
        province varchar(255), 
        province_code varchar(255), 
        country varchar(255),
        address2 varchar(255), 
        company varchar(255), 
        country_code varchar(255), 
        source_id integer, 
        store_line_item_id integer,
        sku varchar(255), 
        quantity integer,
        price varchar(255), 
        line_item_print_url varchar(255),
        status varchar(255)
        );`;

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}