const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'investment', 'profit', 'referral', 'bonus', 'admin'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  reference: {
    type: String,
    default: ''
  },
  adminNote: {
    type: String,
    default: ''
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
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

// Update the updatedAt timestamp before saving
TransactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate a unique reference number if not provided
TransactionSchema.pre('save', function(next) {
  if (!this.reference) {
    const timestamp = Date.now().toString();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.reference = `TXN-${randomStr}-${timestamp.substring(timestamp.length - 6)}`;
  }
  next();
});

module.exports = mongoose.model('Transaction', TransactionSchema);
