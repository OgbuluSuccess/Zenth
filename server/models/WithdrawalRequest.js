const mongoose = require('mongoose');

const withdrawalRequestSchema = new mongoose.Schema({
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
  recipientAddress: {
    type: String,
    required: true,
    trim: true
  },
  recipientMemo: { // For assets like XRP, XLM
    type: String,
    trim: true,
    default: null
  },
  amountRequested: { // Gross amount user wants to withdraw
    type: String, // Store as string for precision
    required: true
  },
  withdrawalFee: { // Fee applied at the time of request
    type: String, // Store as string for precision
    required: true
  },
  netAmountToTransfer: { // amountRequested - withdrawalFee
    type: String, // Store as string for precision
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: [
      'pending_review',       // Submitted, awaiting admin/system review
      'pending_approval',     // Reviewed, awaiting final approval (e.g., 2-person approval)
      'approved',             // Approved, ready for processing by a batch job
      'processing',           // Hot wallet is attempting to send
      'awaiting_confirmation',// Transaction broadcasted, waiting for blockchain confirmation
      'completed',            // Successfully confirmed on blockchain and credited externally
      'partially_completed',  // Rare, if a withdrawal is split
      'requires_manual_intervention',
      'failed',               // Failed (e.g., insufficient hot wallet funds, blockchain rejection)
      'cancelled'             // Cancelled by user or admin before processing
    ],
    default: 'pending_review'
  },
  twoFactorCodeProvided: { type: String }, // Store for audit, but verify immediately and don't rely on it long-term
  blockchainTxHash: { type: String, trim: true, default: null },
  failureReason: { type: String, default: null }, // If status is 'failed'
  adminNotes: { type: String }, // Notes from admin reviewing/processing the request
  processedAt: { type: Date }, // When it moved to 'processing' or 'completed'
  completedAt: { type: Date } // When fully completed
}, { timestamps: true });

withdrawalRequestSchema.index({ user: 1, status: 1 });
withdrawalRequestSchema.index({ assetId: 1, status: 1 });
withdrawalRequestSchema.index({ blockchainTxHash: 1 });

const WithdrawalRequest = mongoose.model('WithdrawalRequest', withdrawalRequestSchema);

module.exports = WithdrawalRequest;
