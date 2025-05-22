const ReferralSetting = require('../models/ReferralSetting');

// Get current referral settings
exports.getReferralSettings = async (req, res) => {
  try {
    // Get the most recent settings
    let settings = await ReferralSetting.findOne({ active: true }).sort({ updatedAt: -1 });
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = await ReferralSetting.create({
        pointsPerReferral: 100,
        bonusPointsThreshold: 5,
        bonusPoints: 500,
        minimumInvestmentAmount: 100,
        active: true
      });
    }
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error getting referral settings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update referral settings
exports.updateReferralSettings = async (req, res) => {
  try {
    const { 
      pointsPerReferral, 
      bonusPointsThreshold, 
      bonusPoints, 
      minimumInvestmentAmount 
    } = req.body;
    
    // Validate input
    if (pointsPerReferral < 0 || bonusPointsThreshold < 0 || bonusPoints < 0 || minimumInvestmentAmount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Values cannot be negative'
      });
    }
    
    // Deactivate current settings
    await ReferralSetting.updateMany({}, { active: false });
    
    // Create new settings
    const newSettings = await ReferralSetting.create({
      pointsPerReferral: pointsPerReferral || 100,
      bonusPointsThreshold: bonusPointsThreshold || 5,
      bonusPoints: bonusPoints || 500,
      minimumInvestmentAmount: minimumInvestmentAmount || 100,
      active: true
    });
    
    res.status(200).json({
      success: true,
      message: 'Referral settings updated successfully',
      data: newSettings
    });
  } catch (error) {
    console.error('Error updating referral settings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get referral settings history
exports.getReferralSettingsHistory = async (req, res) => {
  try {
    const history = await ReferralSetting.find()
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error getting referral settings history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
