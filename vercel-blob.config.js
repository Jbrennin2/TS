const VercelBlob = require('@vercel/blob');

const config = {
  projectId: process.env.VERCEL_PROJECT_ID, // Your Vercel project ID
  secretKey: process.env.BLOB_READ_WRITE_TOKEN, // Your Vercel Blob secret key
};

const blob = new VercelBlob(config);

module.exports = blob;