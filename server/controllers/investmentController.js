const Investment = require('../models/Investment');
const InvestmentPlan = require('../models/InvestmentPlan');
const User = require('../models/User');
const Reward = require('../models/Reward');
const Referral = require('../models/Referral');

// Create a new investment
exports.createInvestment = async (req, res) => {
  try {
    const { planId, amount } = req.body;
    const userId = req.user.id;
    
    if (!planId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Plan ID and investment amount are required'
      });
    }
    
    // Validate amount is a positive number
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Investment amount must be greater than 0'
      });
    }
    
    // Find the investment plan
    const plan = await InvestmentPlan.findById(planId);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Investment plan not found'
      });
    }
    
    // Check if plan is active
    if (!plan.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This investment plan is currently not available'
      });
    }
    
    // Check if amount meets minimum investment requirement
    if (amount < plan.minimumInvestment) {
      return res.status(400).json({
        success: false,
        message: `Minimum investment amount for this plan is ${plan.minimumInvestment}`
      });
    }
    
    // Get user to check wallet balance
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user has enough balance
    if (user.wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance'
      });
    }
    
    // Create the investment
    const investment = await Investment.create({
      user: userId,
      plan: planId,
      amount,
      currentValue: amount, // Initial value is the same as the investment amount
      startDate: Date.now(),
      duration: plan.duration, // Add duration from the plan
      status: 'active',
      valueHistory: [{ value: amount, timestamp: Date.now() }],
      transactions: [{
        type: 'deposit',
        amount,
        description: `Initial investment in ${plan.name}`,
        timestamp: Date.now()
      }]
    });
    
    // Deduct amount from user's wallet
    user.wallet.balance -= amount;
    user.totalInvested += amount;
    await user.save();
    
    // Create a transaction record
    const Transaction = require('../models/Transaction');
    await Transaction.create({
      user: userId,
      type: 'investment',
      amount,
      description: `Investment in ${plan.name} plan`,
      status: 'completed',
      reference: `INV-${investment._id}`,
    });
    
    // Add reward points for investment
    let reward = await Reward.findOne({ user: userId });
    if (!reward) {
      reward = await Reward.create({
        user: userId,
        points: 0,
        level: 'Bronze'
      });
    }
    
    // Calculate reward points (1 point per $10 invested)
    const rewardPoints = Math.floor(amount / 10);
    await reward.addPoints(
      rewardPoints,
      'investment',
      `Points for investing $${amount} in ${plan.name}`
    );
    
    // Check if this is the user's first investment and they were referred
    if (user.referredBy) {
      // Find if there's a pending referral
      const referral = await Referral.findOne({
        referrer: user.referredBy,
        referee: userId,
        status: 'pending'
      });
      
      if (referral) {
        // Complete the referral
        referral.status = 'completed';
        referral.completedAt = Date.now();
        await referral.save();
        
        // Reward the referral
        const referrerRewardPoints = 500;
        const refereeRewardPoints = 200;
        
        // Update referral with reward info
        referral.referrerReward = referrerRewardPoints;
        referral.refereeReward = refereeRewardPoints;
        referral.status = 'rewarded';
        referral.rewardedAt = Date.now();
        await referral.save();
        
        // Add points to referrer's reward account
        const referrer = await User.findById(user.referredBy);
        let referrerReward = await Reward.findOne({ user: referrer._id });
        if (!referrerReward) {
          referrerReward = await Reward.create({
            user: referrer._id,
            points: 0,
            level: 'Bronze'
          });
        }
        await referrerReward.addPoints(
          referrerRewardPoints,
          'referral',
          `Reward for referring ${user.name} who made their first investment`
        );
        
        // Add additional points to referee's reward account
        await reward.addPoints(
          refereeRewardPoints,
          'referral',
          'Bonus for making your first investment after being referred'
        );
      }
    }
    
    res.status(201).json({
      success: true,
      message: 'Investment created successfully',
      data: {
        investment,
        rewardPoints,
        newWalletBalance: user.wallet.balance
      }
    });
  } catch (error) {
    console.error('Error creating investment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all investments for a user
exports.getUserInvestments = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all investments for this user
    const investments = await Investment.find({ user: userId })
      .populate('plan')
      .sort({ startDate: -1 });
    
    // Calculate total investment and current value
    const totalInvested = investments.reduce((total, inv) => total + inv.amount, 0);
    const totalCurrentValue = investments.reduce((total, inv) => total + inv.currentValue, 0);
    const totalProfit = totalCurrentValue - totalInvested;
    const totalProfitPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
    
    // Group investments by status
    const activeInvestments = investments.filter(inv => inv.status === 'active');
    const completedInvestments = investments.filter(inv => inv.status === 'completed');
    const cancelledInvestments = investments.filter(inv => inv.status === 'cancelled');
    
    res.status(200).json({
      success: true,
      data: {
        investments,
        summary: {
          totalInvestments: investments.length,
          activeInvestments: activeInvestments.length,
          completedInvestments: completedInvestments.length,
          cancelledInvestments: cancelledInvestments.length,
          totalInvested,
          totalCurrentValue,
          totalProfit,
          totalProfitPercentage: parseFloat(totalProfitPercentage.toFixed(2))
        }
      }
    });
  } catch (error) {
    console.error('Error getting user investments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get a single investment by ID
exports.getInvestmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Find the investment
    const investment = await Investment.findById(id).populate('plan');
    
    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }
    
    // Check if the investment belongs to the user
    if (investment.user.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this investment'
      });
    }
    
    res.status(200).json({
      success: true,
      data: investment
    });
  } catch (error) {
    console.error('Error getting investment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update investment value (simulating real-time market changes)
exports.updateInvestmentValue = async (req, res) => {
  try {
    const { id } = req.params;
    const { newValue } = req.body;
    const userId = req.user.id;
    
    // Validate newValue
    if (!newValue || newValue <= 0) {
      return res.status(400).json({
        success: false,
        message: 'New value must be a positive number'
      });
    }
    
    // Find the investment
    const investment = await Investment.findById(id);
    
    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }
    
    // Check if the investment belongs to the user or user is admin
    if (investment.user.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this investment'
      });
    }
    
    // Check if investment is active
    if (investment.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Cannot update value of ${investment.status} investment`
      });
    }
    
    // Update the investment value
    await investment.updateValue(newValue);
    
    // Update user's total profit
    const user = await User.findById(userId);
    if (user) {
      // Calculate profit for this investment
      const profit = investment.currentValue - investment.amount;
      
      // Update user's total profit
      user.totalProfit = profit > 0 ? user.totalProfit + profit : user.totalProfit;
      await user.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Investment value updated successfully',
      data: investment
    });
  } catch (error) {
    console.error('Error updating investment value:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Complete an investment (withdraw funds)
exports.completeInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Find the investment
    const investment = await Investment.findById(id);
    
    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }
    
    // Check if the investment belongs to the user
    if (investment.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this investment'
      });
    }
    
    // Check if investment is active
    if (investment.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Cannot complete ${investment.status} investment`
      });
    }
    
    // Update investment status
    investment.status = 'completed';
    investment.endDate = Date.now();
    
    // Add withdrawal transaction
    investment.transactions.push({
      type: 'withdrawal',
      amount: investment.currentValue,
      description: 'Investment withdrawal',
      timestamp: Date.now()
    });
    
    await investment.save();
    
    // Update user's wallet balance
    const user = await User.findById(userId);
    if (user) {
      // Calculate profit (if any)
      const initialInvestment = investment.amount;
      const finalValue = investment.currentValue;
      const profit = finalValue - initialInvestment;
      
      // Add the final value to user's wallet
      user.wallet.balance += finalValue;
      
      // If there was profit, update the user's total profit
      if (profit > 0) {
        user.totalProfit += profit;
      }
      
      await user.save();
      
      // Create transaction records
      const Transaction = require('../models/Transaction');
      
      // Create a transaction for the return of principal
      await Transaction.create({
        user: userId,
        type: 'investment',
        amount: initialInvestment,
        description: `Principal returned from ${investment.plan.name || 'investment plan'}`,
        status: 'completed',
        reference: `PRIN-${investment._id}`,
      });
      
      // If there was profit, create a separate transaction for it
      if (profit > 0) {
        await Transaction.create({
          user: userId,
          type: 'profit',
          amount: profit,
          description: `Profit from ${investment.plan.name || 'investment plan'}`,
          status: 'completed',
          reference: `PROF-${investment._id}`,
        });
      }
    }
    
    // Calculate profit and add reward points if profitable
    const profit = investment.currentValue - investment.amount;
    if (profit > 0) {
      // Add reward points for profitable investment (1 point per $5 profit)
      const rewardPoints = Math.floor(profit / 5);
      
      let reward = await Reward.findOne({ user: userId });
      if (!reward) {
        reward = await Reward.create({
          user: userId,
          points: 0,
          level: 'Bronze'
        });
      }
      
      await reward.addPoints(
        rewardPoints,
        'profit',
        `Points for earning $${profit.toFixed(2)} profit on investment`
      );
    }
    
    res.status(200).json({
      success: true,
      message: 'Investment completed successfully',
      data: {
        investment,
        profit: profit > 0 ? profit : 0,
        newWalletBalance: user.wallet.balance
      }
    });
  } catch (error) {
    console.error('Error completing investment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get investment statistics for admin
exports.getInvestmentStats = async (req, res) => {
  try {
    // Ensure user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    }
    
    // Get total investments
    const totalInvestments = await Investment.countDocuments();
    const activeInvestments = await Investment.countDocuments({ status: 'active' });
    const completedInvestments = await Investment.countDocuments({ status: 'completed' });
    const cancelledInvestments = await Investment.countDocuments({ status: 'cancelled' });
    
    // Get total amounts
    const investments = await Investment.find();
    const totalInvestedAmount = investments.reduce((total, inv) => total + inv.amount, 0);
    const totalCurrentValue = investments.reduce((total, inv) => total + inv.currentValue, 0);
    const totalProfit = totalCurrentValue - totalInvestedAmount;
    
    // Get top investors
    const topInvestors = await Investment.aggregate([
      { $group: {
        _id: '$user',
        totalInvested: { $sum: '$amount' },
        totalCurrentValue: { $sum: '$currentValue' },
        investmentCount: { $sum: 1 }
      }},
      { $sort: { totalInvested: -1 } },
      { $limit: 10 },
      { $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userInfo'
      }},
      { $unwind: '$userInfo' },
      { $project: {
        _id: 1,
        totalInvested: 1,
        totalCurrentValue: 1,
        investmentCount: 1,
        profit: { $subtract: ['$totalCurrentValue', '$totalInvested'] },
        'userInfo.name': 1,
        'userInfo.email': 1
      }}
    ]);
    
    // Get most popular investment plans
    const popularPlans = await Investment.aggregate([
      { $group: {
        _id: '$plan',
        totalInvested: { $sum: '$amount' },
        investmentCount: { $sum: 1 }
      }},
      { $sort: { investmentCount: -1 } },
      { $limit: 5 },
      { $lookup: {
        from: 'investmentplans',
        localField: '_id',
        foreignField: '_id',
        as: 'planInfo'
      }},
      { $unwind: '$planInfo' },
      { $project: {
        _id: 1,
        totalInvested: 1,
        investmentCount: 1,
        'planInfo.name': 1,
        'planInfo.riskLevel': 1
      }}
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalInvestments,
        activeInvestments,
        completedInvestments,
        cancelledInvestments,
        totalInvestedAmount,
        totalCurrentValue,
        totalProfit,
        profitPercentage: parseFloat(((totalProfit / totalInvestedAmount) * 100).toFixed(2)),
        topInvestors,
        popularPlans
      }
    });
  } catch (error) {
    console.error('Error getting investment stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
