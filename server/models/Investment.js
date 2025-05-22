const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InvestmentPlan',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currentValue: {
    type: Number,
    required: true
  },
  profit: {
    type: Number,
    default: 0
  },
  profitPercentage: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  duration: {
    type: Number, // Duration in days
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  valueHistory: [{
    value: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  transactions: [{
    type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'interest', 'fee'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});

// Update the investment value
InvestmentSchema.methods.updateValue = async function(newValue) {
  this.currentValue = newValue;
  this.profit = newValue - this.amount;
  this.profitPercentage = (this.profit / this.amount) * 100;
  this.lastUpdated = Date.now();
  
  // Add to value history
  this.valueHistory.push({
    value: newValue,
    timestamp: Date.now()
  });
  
  await this.save();
  return this;
};

// Add a transaction
InvestmentSchema.methods.addTransaction = async function(type, amount, description) {
  this.transactions.push({
    type,
    amount,
    description,
    timestamp: Date.now()
  });
  
  await this.save();
  return this;
};

module.exports = mongoose.model('Investment', InvestmentSchema);
