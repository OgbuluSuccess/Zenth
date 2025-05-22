// Vercel API Route - Main entry point
import { createServer } from 'http';
import { parse } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from '../server/routes/auth.js';
import userRoutes from '../server/routes/userRoutes.js';
import investmentPlanRoutes from '../server/routes/investmentPlanRoutes.js';
import rewardRoutes from '../server/routes/rewardRoutes.js';
import referralRoutes from '../server/routes/referralRoutes.js';
import investmentRoutes from '../server/routes/investmentRoutes.js';
import referralSettingRoutes from '../server/routes/referralSettingRoutes.js';
import transactionRoutes from '../server/routes/transactionRoutes.js';
import walletRoutes from '../server/routes/walletRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
    
    // Seed asset configs if needed
    const { seedAssetConfigs } = require('../server/models/AssetConfig');
    await seedAssetConfigs();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/investment-plans', investmentPlanRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/referral-settings', referralSettingRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/wallet', walletRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Zynith Investment Platform API is running');
});

// Create server
const server = createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  app(req, res);
});

// Export the Express API
export default server;
