const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'build')));

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000
  })
  .then(() => {
    console.log('MongoDB connected successfully');
    // Import API routes after successful connection
    setupApiRoutes();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    // Still set up routes even if MongoDB fails, so static files can be served
    setupApiRoutes();
  });
} else {
  console.warn('MONGODB_URI not provided, skipping database connection');
  // Set up routes without MongoDB
  setupApiRoutes();
}

// Function to set up API routes
function setupApiRoutes() {
  try {
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

    // Import auth middleware
    const { protect, restrictTo } = require('./server/middleware/auth');

    // Test admin endpoint
    app.get('/api/admin/test', protect, restrictTo('admin', 'superadmin'), (req, res) => {
      console.log('Test admin endpoint called');
      console.log('User making request:', req.user);
      res.status(200).json({
        success: true,
        message: 'Admin endpoint working',
        user: req.user
      });
    });
  } catch (error) {
    console.error('Error setting up API routes:', error);
  }

  // API health check route
  app.get('/api', (req, res) => {
    res.json({
      success: true,
      message: 'Zynith Investment Platform API is running',
      version: '1.0.0'
    });
  });

  // Debug endpoint to check MongoDB connection and environment variables
  app.get('/api/debug', (req, res) => {
    res.json({
      success: true,
      mongodbConnected: mongoose.connection.readyState === 1,
      mongodbUri: process.env.MONGODB_URI ? 'Configured (hidden for security)' : 'Not configured',
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || '10000 (default)',
      jwtSecret: process.env.JWT_SECRET ? 'Configured (hidden for security)' : 'Not configured'
    });
  });

  // Catch-all route to serve the React app for any other routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server accessible at: http://localhost:${PORT}`);
});
