const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const { 
  getReferralSettings, 
  updateReferralSettings, 
  getReferralSettingsHistory 
} = require('../controllers/referralSettingController');

const router = express.Router();

// Public route to get current referral settings
router.get('/', getReferralSettings);

// Admin routes
router.use(protect);
router.use(restrictTo('admin', 'superadmin'));

router.put('/', updateReferralSettings);
router.get('/history', getReferralSettingsHistory);

module.exports = router;
