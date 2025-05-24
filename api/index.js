// Vercel API Route - Main entry point
const { createServer } = require('http');
const { parse } = require('url');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const authRoutes = require('../server/routes/auth');
const userRoutes = require('../server/routes/userRoutes');
const investmentPlanRoutes = require('../server/routes/investmentPlanRoutes');
const rewardRoutes = require('../server/routes/rewardRoutes');
const referralRoutes = require('../server/routes/referralRoutes');
const investmentRoutes = require('../server/routes/investmentRoutes');
const referralSettingRoutes = require('../server/routes/referralSettingRoutes');
const transactionRoutes = require('../server/routes/transactionRoutes');
const walletRoutes = require('../server/routes/walletRoutes');

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

// If running directly (not through Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Server accessible at: http://localhost:${PORT}`);
    console.log('Server listening on all network interfaces (0.0.0.0)');
  });
}

// Export the Express API
module.exports = server;
