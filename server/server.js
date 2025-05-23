const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
// Configure CORS to allow requests from any origin
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
  connectTimeoutMS: 30000 // Increase connection timeout to 30 seconds
})
.then(async () => {
  console.log('MongoDB connected successfully');
  const { seedAssetConfigs } = require('./models/AssetConfig'); // <-- Import here
  await seedAssetConfigs(); // <-- Call the seeder function
})
.catch(err => console.error('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes'); // Updated to use new comprehensive user routes
const investmentPlanRoutes = require('./routes/investmentPlanRoutes'); // Added Investment Plan Routes
const rewardRoutes = require('./routes/rewardRoutes'); // Reward system routes
const referralRoutes = require('./routes/referralRoutes'); // Referral system routes
const investmentRoutes = require('./routes/investmentRoutes'); // Investment tracking routes
const referralSettingRoutes = require('./routes/referralSettingRoutes'); // Referral settings routes
const transactionRoutes = require('./routes/transactionRoutes'); // Transaction routes
const walletRoutes = require('./routes/walletRoutes'); // <-- Import Wallet Routes

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/investment-plans', investmentPlanRoutes); // Use Investment Plan Routes
app.use('/api/rewards', rewardRoutes); // Use Reward Routes
app.use('/api/referrals', referralRoutes); // Use Referral Routes
app.use('/api/investments', investmentRoutes); // Use Investment Routes
app.use('/api/referral-settings', referralSettingRoutes); // Use Referral Settings Routes
app.use('/api/transactions', transactionRoutes); // Use Transaction Routes
app.use('/api/wallet', walletRoutes); // <-- Use Wallet Routes

// Test admin endpoint directly in server.js
const { protect, restrictTo } = require('./middleware/auth');
app.get('/api/admin/test', protect, restrictTo('admin', 'superadmin'), (req, res) => {
  console.log('Test admin endpoint called');
  console.log('User making request:', req.user);
  res.status(200).json({
    success: true,
    message: 'Admin endpoint working',
    user: req.user
  });
});

// Default route
app.get('/', (req, res) => {
  res.send('Zynith Investment Platform API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Default to all interfaces if not specified
const NETWORK_IP = process.env.NETWORK_IP || '172.20.10.3'; // Your machine's network IP

// Listen on the configured host interface
app.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server accessible at:`);
  console.log(`- Local: http://localhost:${PORT}`);
  console.log(`- Network: http://${NETWORK_IP}:${PORT}`);
  console.log(`- API Base URL: http://${NETWORK_IP}:${PORT}/api`);
});
