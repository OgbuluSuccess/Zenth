const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  createInvestment,
  getUserInvestments,
  getInvestmentById,
  updateInvestmentValue,
  completeInvestment,
  getInvestmentStats
} = require('../controllers/investmentController');

// All routes are protected
router.use(protect);

// Create a new investment
router.post('/', createInvestment);

// Get all investments for the current user
router.get('/me', getUserInvestments);

// Get a single investment by ID
router.get('/:id', getInvestmentById);

// Update investment value (simulating real-time market changes)
router.patch('/:id/value', updateInvestmentValue);

// Complete an investment (withdraw funds)
router.patch('/:id/complete', completeInvestment);

// Get investment statistics (admin only)
router.get('/stats/admin', restrictTo('admin', 'superadmin'), getInvestmentStats);

module.exports = router;
