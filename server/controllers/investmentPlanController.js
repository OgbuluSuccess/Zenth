const InvestmentPlan = require('../models/InvestmentPlan');
const asyncHandler = require('express-async-handler'); // For cleaner async error handling

// @desc    Create a new investment plan
// @route   POST /api/investment-plans
// @access  Private/Admin
const createInvestmentPlan = asyncHandler(async (req, res) => {
  const {
    name,
    targetAudience,
    description,
    minimumInvestment,
    duration,
    returnRate,
    assets,
    expectedReturns,
    riskLevel,
    features,
    whyGreat,
    isActive
  } = req.body;

  // Basic validation (more can be added based on model requirements)
  if (!name || !targetAudience || !description || !minimumInvestment || !duration || !assets || !expectedReturns || !riskLevel) {
    res.status(400);
    throw new Error('Please add all required fields for the investment plan');
  }

  const investmentPlanExists = await InvestmentPlan.findOne({ name });

  if (investmentPlanExists) {
    res.status(400);
    throw new Error('Investment plan with this name already exists');
  }

  const investmentPlan = await InvestmentPlan.create({
    name,
    targetAudience,
    description,
    minimumInvestment,
    duration,
    returnRate,
    assets,
    expectedReturns,
    riskLevel,
    features,
    whyGreat,
    isActive,
    // user: req.user.id // Assuming you have user auth and want to link who created it
  });

  if (investmentPlan) {
    res.status(201).json(investmentPlan);
  } else {
    res.status(400);
    throw new Error('Invalid investment plan data');
  }
});

// @desc    Get all active investment plans
// @route   GET /api/investment-plans
// @access  Public (or Private if only for logged-in users)
const getInvestmentPlans = asyncHandler(async (req, res) => {
  const investmentPlans = await InvestmentPlan.find({ isActive: true }).sort({ createdAt: -1 }); // Show newest first
  res.json(investmentPlans);
});

// @desc    Get investment plan by ID
// @route   GET /api/investment-plans/:id
// @access  Public
const getInvestmentPlanById = asyncHandler(async (req, res) => {
  const investmentPlan = await InvestmentPlan.findById(req.params.id);
  
  if (investmentPlan) {
    res.json(investmentPlan);
  } else {
    res.status(404);
    throw new Error('Investment plan not found');
  }
});

// @desc    Update an investment plan
// @route   PUT /api/investment-plans/:id
// @access  Private/Admin
const updateInvestmentPlan = asyncHandler(async (req, res) => {
  const {
    name,
    targetAudience,
    description,
    minimumInvestment,
    duration,
    returnRate,
    assets,
    expectedReturns,
    riskLevel,
    features,
    whyGreat,
    isActive
  } = req.body;

  const investmentPlan = await InvestmentPlan.findById(req.params.id);

  if (!investmentPlan) {
    res.status(404);
    throw new Error('Investment plan not found');
  }

  // Check if updating to a name that already exists (but not the current plan)
  if (name && name !== investmentPlan.name) {
    const nameExists = await InvestmentPlan.findOne({ name });
    if (nameExists) {
      res.status(400);
      throw new Error('Investment plan with this name already exists');
    }
  }

  // Update the plan
  investmentPlan.name = name || investmentPlan.name;
  investmentPlan.targetAudience = targetAudience || investmentPlan.targetAudience;
  investmentPlan.description = description || investmentPlan.description;
  investmentPlan.minimumInvestment = minimumInvestment || investmentPlan.minimumInvestment;
  investmentPlan.duration = duration !== undefined ? duration : investmentPlan.duration;
  investmentPlan.returnRate = returnRate !== undefined ? returnRate : investmentPlan.returnRate;
  investmentPlan.assets = assets || investmentPlan.assets;
  investmentPlan.expectedReturns = expectedReturns || investmentPlan.expectedReturns;
  investmentPlan.riskLevel = riskLevel || investmentPlan.riskLevel;
  investmentPlan.features = features || investmentPlan.features;
  investmentPlan.whyGreat = whyGreat !== undefined ? whyGreat : investmentPlan.whyGreat;
  investmentPlan.isActive = isActive !== undefined ? isActive : investmentPlan.isActive;
  investmentPlan.updatedAt = Date.now();

  const updatedPlan = await investmentPlan.save();
  res.json(updatedPlan);
});

// @desc    Delete an investment plan
// @route   DELETE /api/investment-plans/:id
// @access  Private/Admin
const deleteInvestmentPlan = asyncHandler(async (req, res) => {
  const investmentPlan = await InvestmentPlan.findById(req.params.id);

  if (!investmentPlan) {
    res.status(404);
    throw new Error('Investment plan not found');
  }

  await investmentPlan.deleteOne();
  res.json({ message: 'Investment plan removed' });
});

module.exports = {
  createInvestmentPlan,
  getInvestmentPlans,
  getInvestmentPlanById,
  updateInvestmentPlan,
  deleteInvestmentPlan
};
