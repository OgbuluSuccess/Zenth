const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  level: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    default: 'Bronze'
  },
  totalEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  pointsHistory: [{
    amount: Number,
    action: String, // e.g., 'investment', 'referral', 'login', 'bonus'
    description: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  rewards: [{
    type: String,
    name: String,
    description: String,
    pointsCost: Number,
    redeemed: {
      type: Boolean,
      default: false
    },
    redeemedAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update level based on points
RewardSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Update level based on points
  if (this.points >= 10000) {
    this.level = 'Diamond';
  } else if (this.points >= 5000) {
    this.level = 'Platinum';
  } else if (this.points >= 2000) {
    this.level = 'Gold';
  } else if (this.points >= 500) {
    this.level = 'Silver';
  } else {
    this.level = 'Bronze';
  }
  
  next();
});

// Method to add points
RewardSchema.methods.addPoints = async function(amount, action, description) {
  this.points += amount;
  this.totalEarned += amount;
  
  this.pointsHistory.push({
    amount,
    action,
    description,
    timestamp: Date.now()
  });
  
  await this.save();
  return this;
};

// Method to redeem a reward
RewardSchema.methods.redeemReward = async function(rewardId) {
  const reward = this.rewards.id(rewardId);
  
  if (!reward) {
    throw new Error('Reward not found');
  }
  
  if (reward.redeemed) {
    throw new Error('Reward already redeemed');
  }
  
  if (this.points < reward.pointsCost) {
    throw new Error('Not enough points to redeem this reward');
  }
  
  this.points -= reward.pointsCost;
  reward.redeemed = true;
  reward.redeemedAt = Date.now();
  
  await this.save();
  return this;
};

module.exports = mongoose.model('Reward', RewardSchema);
