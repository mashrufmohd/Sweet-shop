import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import sweetsRoutes from './routes/sweets.js';
import ordersRoutes from './routes/orders.js';
import analyticsRoutes from './routes/analytics.js';

dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',')
  : [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8080',
    ];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches patterns
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });
    
    // Also allow .vercel.app and common deployment platforms
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
app.use('/static', express.static('static'));

// Serve frontend static files in production
app.use(express.static('public'));

// API Root endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Sweet Spot Manager API' });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/sweets', sweetsRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
