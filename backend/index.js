import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import authRoutes from './routes/auth.js';
import sweetsRoutes from './routes/sweets.js';
import ordersRoutes from './routes/orders.js';
import analyticsRoutes from './routes/analytics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',')
  : [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8080',
    ];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });
    
    const isVercel = /\.vercel\.app$/.test(origin);
    const isRailway = /\.railway\.app$/.test(origin);
    const isRender = /\.onrender\.com$/.test(origin);
    const isNetlify = /\.netlify\.app$/.test(origin);
    
    if (isAllowed || isVercel || isRailway || isRender || isNetlify) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Sweet Spot Manager API' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/sweets', sweetsRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`
      <h1>Sweet Shop API</h1>
      <p>Frontend not found. The API is running at <a href="/api">/api</a></p>
      <p>Public directory: ${path.join(__dirname, 'public')}</p>
      <p>Looking for: ${indexPath}</p>
    `);
  }
});

mongoose.connect(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
