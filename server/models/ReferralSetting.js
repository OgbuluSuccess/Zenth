const mongoose = require('mongoose');

const ReferralSettingSchema = new mongoose.Schema({
  pointsPerReferral: {
    type: Number,
    required: true,
    default: 100
  },
  bonusPointsThreshold: {
    type: Number,
    default: 5,
    description: 'Number of referrals needed to earn bonus points'
  },
  bonusPoints: {
    type: Number,
    default: 500,
    description: 'Bonus points awarded when threshold is reached'
  },
  minimumInvestmentAmount: {
    type: Number,
    default: 100,
    description: 'Minimum investment amount for a referral to count'
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
ReferralSettingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ReferralSetting', ReferralSettingSchema);
