const Referral = require('../models/Referral');
const User = require('../models/User');
const Reward = require('../models/Reward');

// Get referral info for the current user
exports.getUserReferralInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user with referral code
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get referrals made by this user
    const referrals = await Referral.find({ referrer: userId })
      .populate('referee', 'name email createdAt')
      .sort({ createdAt: -1 });
    
    // Count completed referrals
    const completedReferrals = referrals.filter(ref => 
      ref.status === 'completed' || ref.status === 'rewarded'
    ).length;
    
    // Calculate total rewards earned from referrals
    const totalRewards = referrals.reduce((total, ref) => total + ref.referrerReward, 0);
    
    res.status(200).json({
      success: true,
      data: {
        referralCode: user.referralCode,
        referralLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/register?ref=${user.referralCode}`,
        totalReferrals: referrals.length,
        completedReferrals,
        pendingReferrals: referrals.length - completedReferrals,
        totalRewardsEarned: totalRewards,
        referrals: referrals
      }
    });
  } catch (error) {
    console.error('Error getting referral info:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Register a new referral when a user signs up with a referral code
exports.registerReferral = async (req, res) => {
  try {
    const { referralCode } = req.body;
    const newUserId = req.user.id; // The newly registered user
    
    if (!referralCode) {
      return res.status(400).json({
        success: false,
        message: 'Referral code is required'
      });
    }
    
    // Find the referrer using the referral code
    const referrer = await User.findOne({ referralCode });
    
    if (!referrer) {
      return res.status(404).json({
        success: false,
        message: 'Invalid referral code'
      });
    }
    
    // Make sure the user isn't referring themselves
    if (referrer._id.toString() === newUserId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot refer yourself'
      });
    }
    
    // Check if this referral already exists
    const existingReferral = await Referral.findOne({
      referrer: referrer._id,
      referee: newUserId
    });
    
    if (existingReferral) {
      return res.status(400).json({
        success: false,
        message: 'This referral has already been registered'
      });
    }
    
    // Create the new referral
    const referral = await Referral.create({
      referrer: referrer._id,
      referee: newUserId,
      referralCode,
      status: 'pending'
    });
    
    // Update the new user's referredBy field
    await User.findByIdAndUpdate(newUserId, { referredBy: referrer._id });
    
    res.status(201).json({
      success: true,
      message: 'Referral registered successfully',
      data: referral
    });
  } catch (error) {
    console.error('Error registering referral:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Complete a referral when the referred user makes their first investment
exports.completeReferral = async (req, res) => {
  try {
    const userId = req.user.id; // The user who made an investment
    
    // Find if this user was referred
    const user = await User.findById(userId).populate('referredBy');
    
    if (!user || !user.referredBy) {
      return res.status(404).json({
        success: false,
        message: 'No referral found for this user'
      });
    }
    
    // Find the referral
    const referral = await Referral.findOne({
      referrer: user.referredBy._id,
      referee: userId,
      status: 'pending' // Only complete pending referrals
    });
    
    if (!referral) {
      return res.status(404).json({
        success: false,
        message: 'No pending referral found'
      });
    }
    
    // Update the referral status
    referral.status = 'completed';
    referral.completedAt = Date.now();
    await referral.save();
    
    res.status(200).json({
      success: true,
      message: 'Referral completed successfully',
      data: referral
    });
  } catch (error) {
    console.error('Error completing referral:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Reward a completed referral
exports.rewardReferral = async (req, res) => {
  try {
    const { referralId } = req.params;
    
    // Find the referral
    const referral = await Referral.findById(referralId)
      .populate('referrer')
      .populate('referee');
    
    if (!referral) {
      return res.status(404).json({
        success: false,
        message: 'Referral not found'
      });
    }
    
    // Check if the referral is completed but not yet rewarded
    if (referral.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: `Cannot reward referral with status: ${referral.status}`
      });
    }
    
    // Define reward amounts
    const referrerRewardPoints = 500; // Points for the referrer
    const refereeRewardPoints = 200; // Points for the referee
    
    // Update referral with reward info
    referral.referrerReward = referrerRewardPoints;
    referral.refereeReward = refereeRewardPoints;
    referral.status = 'rewarded';
    referral.rewardedAt = Date.now();
    await referral.save();
    
    // Add points to referrer's reward account
    let referrerReward = await Reward.findOne({ user: referral.referrer._id });
    if (!referrerReward) {
      referrerReward = await Reward.create({
        user: referral.referrer._id,
        points: 0,
        level: 'Bronze'
      });
    }
    await referrerReward.addPoints(
      referrerRewardPoints,
      'referral',
      `Reward for referring ${referral.referee.name}`
    );
    
    // Add points to referee's reward account
    let refereeReward = await Reward.findOne({ user: referral.referee._id });
    if (!refereeReward) {
      refereeReward = await Reward.create({
        user: referral.referee._id,
        points: 0,
        level: 'Bronze'
      });
    }
    await refereeReward.addPoints(
      refereeRewardPoints,
      'referral',
      'Welcome bonus for joining via referral'
    );
    
    res.status(200).json({
      success: true,
      message: 'Referral rewarded successfully',
      data: {
        referral,
        referrerPoints: referrerRewardPoints,
        refereePoints: refereeRewardPoints
      }
    });
  } catch (error) {
    console.error('Error rewarding referral:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get referral statistics for admin
exports.getReferralStats = async (req, res) => {
  try {
    // Ensure user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    }
    
    // Get counts of referrals by status
    const totalReferrals = await Referral.countDocuments();
    const pendingReferrals = await Referral.countDocuments({ status: 'pending' });
    const completedReferrals = await Referral.countDocuments({ status: 'completed' });
    const rewardedReferrals = await Referral.countDocuments({ status: 'rewarded' });
    
    // Get total rewards given
    const referrals = await Referral.find({ status: 'rewarded' });
    const totalReferrerRewards = referrals.reduce((total, ref) => total + ref.referrerReward, 0);
    const totalRefereeRewards = referrals.reduce((total, ref) => total + ref.refereeReward, 0);
    
    // Get top referrers
    const topReferrers = await Referral.aggregate([
      { $group: {
        _id: '$referrer',
        count: { $sum: 1 },
        completedCount: {
          $sum: {
            $cond: [{ $in: ['$status', ['completed', 'rewarded']] }, 1, 0]
          }
        },
        totalRewards: { $sum: '$referrerReward' }
      }},
      { $sort: { completedCount: -1 } },
      { $limit: 10 },
      { $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'referrerInfo'
      }},
      { $unwind: '$referrerInfo' },
      { $project: {
        _id: 1,
        count: 1,
        completedCount: 1,
        totalRewards: 1,
        'referrerInfo.name': 1,
        'referrerInfo.email': 1
      }}
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalReferrals,
        pendingReferrals,
        completedReferrals,
        rewardedReferrals,
        totalReferrerRewards,
        totalRefereeRewards,
        totalRewardsGiven: totalReferrerRewards + totalRefereeRewards,
        topReferrers
      }
    });
  } catch (error) {
    console.error('Error getting referral stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
