const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth'); // Assuming 'protect' verifies JWT and attaches user
const {
    getWalletAssets,
    getDepositAddress,
    requestWithdrawal
} = require('../controllers/walletController');

// All routes in this file will be protected
router.use(protect);

// GET /api/wallet/assets - Get all supported assets and user balances for them
router.get('/assets', getWalletAssets);

// GET /api/wallet/deposit-address?assetId=btc - Get/generate deposit address for an asset
router.get('/deposit-address', getDepositAddress);

// POST /api/wallet/withdrawals - Initiate a new withdrawal request
router.post('/withdrawals', requestWithdrawal);

// TODO:
// GET /api/wallet/withdrawals - Get user's withdrawal history
// GET /api/wallet/deposits - Get user's deposit history (requires a Deposit model and tracking)

module.exports = router;
