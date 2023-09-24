import { NextApiRequest, NextApiResponse } from 'next';
import { VercelBlob } from '@vercel/blob';

const config = {
  projectId: process.env.VERCEL_PROJECT_ID, // Your Vercel project ID
  secretKey: process.env.BLOB_READ_WRITE_TOKEN, // Your Vercel Blob secret key
};

const blob = new VercelBlob(config);

export default async function handler(req, res) {
  const { filename, contentType, expiresAt } = req.body;

  const presignedUrl = await blob.generatePresignedUrl({
    pathname: `/my-file/${filename}`,
    contentType,
    expiresAt,
  });

  res.status(200).json({ presignedUrl });
}