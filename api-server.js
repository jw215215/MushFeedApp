import express from 'express';
import cors from 'cors';
import shopLookHandler from './api/shop-look.js';
import config from './config.js';

const app = express();
const port = 3000;

// Enable CORS for the React frontend
app.use(cors({
  origin: config.isVercel ? 'https://mush-feed-app.vercel.app' : 'http://localhost:5173',
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Adapt the Vercel API handler to Express
app.post('/api/shop-look', (req, res) => {
  shopLookHandler(req, res);
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
