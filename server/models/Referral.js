const mongoose = require('mongoose');

const ReferralSchema = new mongoose.Schema({
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referralCode: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'rewarded'],
    default: 'pending'
  },
  referrerReward: {
    type: Number,
    default: 0
  },
  refereeReward: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date
  },
  rewardedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a unique compound index to prevent duplicate referrals
ReferralSchema.index({ referrer: 1, referee: 1 }, { unique: true });

module.exports = mongoose.model('Referral', ReferralSchema);
