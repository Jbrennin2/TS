import { NextResponse } from 'next/server';
import OpenAI from "openai";


export async function GET(request) {
 console.log('INPOST')
const openai = new OpenAI();
    
try {
    const image = await openai.images.generate({ prompt: "A paint brush logo with sharp edges" });
    console.log('IMAGE:', image)
    return NextResponse.json('IMAGE:', image);

} catch (e) {
    console.log('ERROR:', e);
    return NextResponse.json('error', e);
}

}
