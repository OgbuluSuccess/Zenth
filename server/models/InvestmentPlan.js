const mongoose = require('mongoose');

const AssetAllocationSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., 'Bitcoin', 'Ethereum'
  percentage: { type: Number, required: true } // e.g., 60, 40
}, { _id: false });

const InvestmentPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a plan name'],
    trim: true,
    unique: true
  },
  targetAudience: {
    type: String,
    required: [true, 'Please provide a target audience']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  minimumInvestment: {
    type: Number,
    required: [true, 'Please provide a minimum investment amount']
  },
  assets: {
    type: [AssetAllocationSchema], // Array of assets with their allocation
    required: true,
    validate: [value => value.length > 0, 'At least one asset must be specified']
  },
  expectedReturns: {
    type: String, // e.g., "5-10% annually"
    required: [true, 'Please provide expected returns']
  },
  duration: {
    type: Number, // Duration in days
    required: [true, 'Please provide the investment duration in days']
  },
  returnRate: {
    type: Number, // Monthly return rate percentage
    required: [true, 'Please provide the monthly return rate']
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: [true, 'Please specify the risk level']
  },
  features: {
    type: [String], // Array of feature descriptions
    default: []
  },
  whyGreat: {
    type: String,
    default: ''
  },
  isActive: { // To control visibility on the frontend
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

// Middleware to update 'updatedAt' field before saving
InvestmentPlanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('InvestmentPlan', InvestmentPlanSchema);
