const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'build')));

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
  // Import and seed asset configs if needed
  try {
    const { seedAssetConfigs } = require('./server/models/AssetConfig');
    await seedAssetConfigs();
  } catch (error) {
    console.error('Error seeding asset configs:', error);
  }
})
.catch(err => console.error('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./server/routes/auth');
const userRoutes = require('./server/routes/userRoutes');
const investmentPlanRoutes = require('./server/routes/investmentPlanRoutes');
const rewardRoutes = require('./server/routes/rewardRoutes');
const referralRoutes = require('./server/routes/referralRoutes');
const investmentRoutes = require('./server/routes/investmentRoutes');
const referralSettingRoutes = require('./server/routes/referralSettingRoutes');
const transactionRoutes = require('./server/routes/transactionRoutes');
const walletRoutes = require('./server/routes/walletRoutes');

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

// Test admin endpoint
const { protect, restrictTo } = require('./server/middleware/auth');
app.get('/api/admin/test', protect, restrictTo('admin', 'superadmin'), (req, res) => {
  console.log('Test admin endpoint called');
  console.log('User making request:', req.user);
  res.status(200).json({
    success: true,
    message: 'Admin endpoint working',
    user: req.user
  });
});

// API health check route
app.get('/api', (req, res) => {
  res.send('Zynith Investment Platform API is running');
});

// Catch-all route to serve the React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server accessible at:`);
  console.log(`- Local: http://localhost:${PORT}`);
  console.log(`- Network: http://${process.env.NETWORK_IP || 'your-network-ip'}:${PORT}`);
  console.log(`- API Base URL: http://${process.env.NETWORK_IP || 'your-network-ip'}:${PORT}/api`);
});
