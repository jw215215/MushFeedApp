import cors from 'cors';
import shopLookHandler from '../src/api/shop-look.js';
import config from '../config.js';

// Configure CORS
const corsMiddleware = cors({
  origin: config.isVercel ? 'https://mush-feed-app.vercel.app' : 'http://localhost:5173',
  credentials: true
});

// Wrap in a promise to handle async CORS
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

// Vercel serverless function
export default async function handler(req, res) {
  // Handle CORS
  await runMiddleware(req, res, corsMiddleware);
  
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Handle the request
  return shopLookHandler(req, res);
} 