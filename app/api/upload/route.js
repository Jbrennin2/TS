import { handleUpload } from '@vercel/blob/client';

export async function POST(request) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({ body, request });

    return new Response(JSON.stringify(jsonResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error).message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}