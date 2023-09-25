import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

console.log(process.env.BLOB_READ_WRITE_TOKEN)
process.env.BLOB_READ_WRITE_TOKEN = process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN
console.log(process.env.BLOB_READ_WRITE_TOKEN)

async function streamToBuffer(readableStream) {
  const chunks = [];
  for await (const chunk of readableStream) {
      chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(request) {
  const fileBuffer = await streamToBuffer(request.body);
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  const blob = await put(filename, fileBuffer, {
      access: 'public',
  });

  return NextResponse.json(blob);
}
