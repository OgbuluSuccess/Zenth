const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  getUserRewards,
  addPoints,
  getAvailableRewards,
  redeemReward,
  getRewardHistory
} = require('../controllers/rewardController');

// All routes are protected
router.use(protect);

// Get user's rewards
router.get('/me', getUserRewards);

// Add points to user's account
router.post('/points', addPoints);

// Get available rewards for user
router.get('/available', getAvailableRewards);

// Redeem a reward
router.post('/redeem', redeemReward);

// Get reward history
router.get('/history', getRewardHistory);

module.exports = router;
