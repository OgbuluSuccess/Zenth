const mongoose = require('mongoose');

const userAssetBalanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assetConfig: { // Reference to the AssetConfig document
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssetConfig',
    required: true
  },
  assetId: { type: String, required: true }, // Denormalized for easier querying, e.g., 'btc'
  availableBalance: {
    type: String, // Store as string for precision, convert to Decimal128 or use a library for math
    required: true,
    default: '0'
  },
  pendingBalance: { // Funds tied up in pending withdrawals or other operations
    type: String,
    required: true,
    default: '0'
  }
}, {
  timestamps: true,
  // Ensure a user can only have one balance entry per asset
  unique: ['user', 'assetConfig'] 
});

// Consider adding methods for safe balance arithmetic if not using a specialized decimal library
// For example, using a library like 'decimal.js' or mongoose-float

const UserAssetBalance = mongoose.model('UserAssetBalance', userAssetBalanceSchema);

module.exports = UserAssetBalance;
