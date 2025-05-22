const Reward = require('../models/Reward');
const User = require('../models/User');

// Get reward details for a user
exports.getUserRewards = async (req, res) => {
  try {
    // Get user ID from authenticated user
    const userId = req.user.id;
    
    // Find or create reward profile
    let reward = await Reward.findOne({ user: userId });
    
    if (!reward) {
      // Create new reward profile if one doesn't exist
      reward = await Reward.create({
        user: userId,
        points: 0,
        level: 'Bronze'
      });
    }
    
    res.status(200).json({
      success: true,
      data: reward
    });
  } catch (error) {
    console.error('Error getting user rewards:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Add points to user's reward account
exports.addPoints = async (req, res) => {
  try {
    const { points, action, description } = req.body;
    const userId = req.user.id;
    
    if (!points || points <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Points must be a positive number'
      });
    }
    
    // Find or create reward profile
    let reward = await Reward.findOne({ user: userId });
    
    if (!reward) {
      reward = await Reward.create({
        user: userId,
        points: 0,
        level: 'Bronze'
      });
    }
    
    // Add points
    await reward.addPoints(points, action, description);
    
    res.status(200).json({
      success: true,
      data: reward,
      message: `${points} points added successfully`
    });
  } catch (error) {
    console.error('Error adding points:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get available rewards for a user
exports.getAvailableRewards = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find user's reward profile
    const reward = await Reward.findOne({ user: userId });
    
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'Reward profile not found'
      });
    }
    
    // Define available rewards based on user's level
    const availableRewards = [];
    
    // Bronze level rewards (available to all)
    availableRewards.push({
      name: 'Free Investment Guide',
      description: 'Download our premium investment guide for free',
      pointsCost: 100,
      level: 'Bronze'
    });
    
    // Silver level and above
    if (['Silver', 'Gold', 'Platinum', 'Diamond'].includes(reward.level)) {
      availableRewards.push({
        name: 'Trading Fee Discount',
        description: '10% discount on trading fees for 1 month',
        pointsCost: 500,
        level: 'Silver'
      });
    }
    
    // Gold level and above
    if (['Gold', 'Platinum', 'Diamond'].includes(reward.level)) {
      availableRewards.push({
        name: 'Premium Support',
        description: 'Access to premium customer support for 3 months',
        pointsCost: 1000,
        level: 'Gold'
      });
      
      availableRewards.push({
        name: 'Investment Cashback',
        description: '1% cashback on your next investment',
        pointsCost: 1500,
        level: 'Gold'
      });
    }
    
    // Platinum level and above
    if (['Platinum', 'Diamond'].includes(reward.level)) {
      availableRewards.push({
        name: 'Exclusive Webinar Access',
        description: 'Access to exclusive investment strategy webinars',
        pointsCost: 2000,
        level: 'Platinum'
      });
      
      availableRewards.push({
        name: 'Personal Investment Advisor',
        description: 'One-hour session with a personal investment advisor',
        pointsCost: 3000,
        level: 'Platinum'
      });
    }
    
    // Diamond level only
    if (reward.level === 'Diamond') {
      availableRewards.push({
        name: 'VIP Investment Opportunity',
        description: 'Access to VIP investment opportunities not available to regular users',
        pointsCost: 5000,
        level: 'Diamond'
      });
      
      availableRewards.push({
        name: 'Luxury Gift',
        description: 'Receive a luxury gift from our premium collection',
        pointsCost: 8000,
        level: 'Diamond'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        userPoints: reward.points,
        userLevel: reward.level,
        availableRewards
      }
    });
  } catch (error) {
    console.error('Error getting available rewards:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Redeem a reward
exports.redeemReward = async (req, res) => {
  try {
    const { rewardName } = req.body;
    const userId = req.user.id;
    
    if (!rewardName) {
      return res.status(400).json({
        success: false,
        message: 'Reward name is required'
      });
    }
    
    // Find user's reward profile
    const reward = await Reward.findOne({ user: userId });
    
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'Reward profile not found'
      });
    }
    
    // Get available rewards for user's level
    const availableRewards = [];
    
    // Add rewards based on level (same logic as getAvailableRewards)
    // Bronze level rewards (available to all)
    availableRewards.push({
      name: 'Free Investment Guide',
      description: 'Download our premium investment guide for free',
      pointsCost: 100,
      level: 'Bronze'
    });
    
    // Add more rewards based on level...
    if (['Silver', 'Gold', 'Platinum', 'Diamond'].includes(reward.level)) {
      availableRewards.push({
        name: 'Trading Fee Discount',
        description: '10% discount on trading fees for 1 month',
        pointsCost: 500,
        level: 'Silver'
      });
    }
    
    // Find the requested reward
    const selectedReward = availableRewards.find(r => r.name === rewardName);
    
    if (!selectedReward) {
      return res.status(404).json({
        success: false,
        message: 'Reward not found or not available for your level'
      });
    }
    
    // Check if user has enough points
    if (reward.points < selectedReward.pointsCost) {
      return res.status(400).json({
        success: false,
        message: 'Not enough points to redeem this reward'
      });
    }
    
    // Deduct points and add to redeemed rewards
    reward.points -= selectedReward.pointsCost;
    reward.rewards.push({
      name: selectedReward.name,
      description: selectedReward.description,
      pointsCost: selectedReward.pointsCost,
      redeemed: true,
      redeemedAt: Date.now()
    });
    
    await reward.save();
    
    res.status(200).json({
      success: true,
      message: `Successfully redeemed ${selectedReward.name}`,
      data: {
        reward,
        redeemedReward: selectedReward
      }
    });
  } catch (error) {
    console.error('Error redeeming reward:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get reward history for a user
exports.getRewardHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find user's reward profile
    const reward = await Reward.findOne({ user: userId });
    
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'Reward profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        pointsHistory: reward.pointsHistory,
        redeemedRewards: reward.rewards.filter(r => r.redeemed)
      }
    });
  } catch (error) {
    console.error('Error getting reward history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
