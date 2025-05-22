const mongoose = require('mongoose');

const depositAddressSchema = new mongoose.Schema({
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
  assetId: { type: String, required: true }, // Denormalized e.g., 'btc'
  address: {
    type: String,
    required: true,
    trim: true
  },
  memo: { // For assets like XRP, XLM (Destination Tag / Memo)
    type: String,
    trim: true,
    default: null
  },
  // qrCodeValue: { type: String }, // Optionally store the full string for QR code if it includes prefixes like 'bitcoin:'
  isActive: { type: Boolean, default: true },
  notes: { type: String } // For any internal notes if needed
}, {
  timestamps: true,
  // Each user should have a unique address (and memo, if applicable) for each asset
  // A simple unique index on user + assetId + address (and memo if always present) might be too restrictive if addresses can change.
  // More practically, you usually want one active address per user per asset.
  // Consider adding an index like: { user: 1, assetId: 1, isActive: 1 } with a unique constraint where isActive: true.
});

// Ensure only one active deposit address per user per asset (if that's the desired logic)
// This is a bit complex to enforce directly with a unique index if old addresses are kept.
// Application logic usually handles ensuring only the latest/active address is shown.

depositAddressSchema.index({ user: 1, assetId: 1, address: 1 }, { unique: true });

const DepositAddress = mongoose.model('DepositAddress', depositAddressSchema);

module.exports = DepositAddress;
