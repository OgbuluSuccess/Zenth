const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  getUserReferralInfo,
  registerReferral,
  completeReferral,
  rewardReferral,
  getReferralStats
} = require('../controllers/referralController');

// All routes are protected
router.use(protect);

// Get user's referral info
router.get('/me', getUserReferralInfo);

// Register a new referral
router.post('/register', registerReferral);

// Complete a referral
router.post('/complete', completeReferral);

// Reward a referral
router.post('/:referralId/reward', rewardReferral);

// Get referral statistics (admin only)
router.get('/stats', restrictTo('admin', 'superadmin'), getReferralStats);

module.exports = router;
