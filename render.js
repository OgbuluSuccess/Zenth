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

// Configure mongoose options globally
mongoose.set('bufferTimeoutMS', 30000); // Increase buffer timeout to 30 seconds (default is 10 seconds)
mongoose.set('maxTimeMS', 60000); // Set max time for operations to 60 seconds

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  console.log('Attempting to connect to MongoDB...');
  
  // Enhanced MongoDB connection options
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000, // Increased from 30000 to 60000
    socketTimeoutMS: 90000, // Increased from 45000 to 90000
    connectTimeoutMS: 60000, // Increased from 30000 to 60000
    heartbeatFrequencyMS: 30000, // Add heartbeat to keep connection alive
    // Disable auto-indexing in production for better performance
    autoIndex: process.env.NODE_ENV !== 'production'
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
    // Add request logging middleware
    app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      next();
    });
    
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

  // Debug endpoint for investment plans
  app.get('/api/debug/investment-plans', async (req, res) => {
    try {
      // Check MongoDB connection status
      if (mongoose.connection.readyState !== 1) {
        return res.status(500).json({
          success: false,
          error: 'MongoDB not connected',
          readyState: mongoose.connection.readyState
        });
      }
      
      // Check if the InvestmentPlan model exists
      const InvestmentPlan = mongoose.models.InvestmentPlan || require('./server/models/InvestmentPlan');
      
      console.log('Attempting to fetch investment plans with timeout settings...');
      
      // Try to get all investment plans with explicit timeout
      const plans = await InvestmentPlan.find({})
        .maxTimeMS(30000) // Set 30 second timeout for this query
        .lean() // Use lean for better performance
        .exec(); // Explicitly execute the query
      
      console.log(`Successfully fetched ${plans ? plans.length : 0} investment plans`);
      
      res.json({
        success: true,
        count: plans ? plans.length : 0,
        mongodbConnected: mongoose.connection.readyState === 1,
        plans: plans ? plans.map(plan => ({
          id: plan._id,
          name: plan.name,
          isActive: plan.isActive
        })) : []
      });
    } catch (error) {
      console.error('Error in debug investment plans:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        mongodbConnected: mongoose.connection.readyState === 1,
        mongodbReadyState: mongoose.connection.readyState,
        stack: process.env.NODE_ENV === 'production' ? null : error.stack
      });
    }
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('API Error:', err.stack);
    
    // Return error response
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || 'Server Error',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
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
