const { AssetConfig } = require('../models/AssetConfig');
const UserAssetBalance = require('../models/UserAssetBalance');
const DepositAddress = require('../models/DepositAddress');
const WithdrawalRequest = require('../models/WithdrawalRequest');
const User = require('../models/User'); // Assuming you have a User model
const mongoose = require('mongoose');

// --- Helper Functions (Consider moving to a service/helper file later) ---

// A simple (naive) function to simulate crypto address generation for placeholder purposes
const generatePlaceholderAddress = (assetSymbol) => {
  const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  if (assetSymbol === 'BTC') return `1SimBTC${randomString.slice(0, 25)}`;
  if (assetSymbol === 'ETH' || assetSymbol === 'USDT') return `0xSimETH${randomString.slice(0, 38)}`;
  return `SimGeneric${randomString.slice(0,30)}`;
};

// --- Controller Methods ---

// @desc    Get all supported asset configurations and user balances
// @route   GET /api/wallet/assets
// @access  Private
exports.getWalletAssets = async (req, res) => {
  try {
    const assetConfigs = await AssetConfig.find({ isActive: true }).lean();
    const userId = req.user.id; // Assuming 'protect' middleware attaches user

    const userBalances = await UserAssetBalance.find({ user: userId }).lean();
    const balancesMap = userBalances.reduce((map, balance) => {
      map[balance.assetId] = balance;
      return map;
    }, {});

    const assetsWithBalances = assetConfigs.map(config => {
      const userBalance = balancesMap[config.assetId];
      return {
        ...config,
        balance: userBalance ? userBalance.availableBalance : '0', // Default to '0' if no balance record
        pendingBalance: userBalance ? userBalance.pendingBalance : '0',
      };
    });

    res.status(200).json(assetsWithBalances);

  } catch (error) {
    console.error('Error in getWalletAssets:', error);
    res.status(500).json({ message: 'Server error while fetching wallet assets.' });
  }
};

// @desc    Get or generate a deposit address for a user and asset
// @route   GET /api/wallet/deposit-address
// @access  Private
exports.getDepositAddress = async (req, res) => {
  const { assetId } = req.query;
  const userId = req.user.id;

  if (!assetId) {
    return res.status(400).json({ message: 'Asset ID is required.' });
  }

  try {
    const assetConfig = await AssetConfig.findOne({ assetId, isActive: true, canDeposit: true });
    if (!assetConfig) {
      return res.status(404).json({ message: 'Asset not found or deposits are disabled for this asset.' });
    }

    let depositAddressEntry = await DepositAddress.findOne({
      user: userId,
      assetId: assetConfig.assetId,
      isActive: true
    });

    if (!depositAddressEntry) {
      // SIMULATION: Generate and store a new placeholder address
      // In a real system, this would involve calls to a crypto node/custody service
      const newAddress = generatePlaceholderAddress(assetConfig.symbol);
      // TODO: Check for address collisions if generation is not guaranteed unique by external service

      depositAddressEntry = new DepositAddress({
        user: userId,
        assetConfig: assetConfig._id,
        assetId: assetConfig.assetId,
        address: newAddress,
        memo: assetConfig.supportsMemo ? 'MEMO_REQUIRED_EXAMPLE' : null // Placeholder for memo if needed
      });
      await depositAddressEntry.save();
    }

    res.status(200).json({
      assetId: depositAddressEntry.assetId,
      address: depositAddressEntry.address,
      memo: depositAddressEntry.memo,
      // qrCodeValue: `bitcoin:${depositAddressEntry.address}` // Example for BTC
    });

  } catch (error) {
    console.error('Error in getDepositAddress:', error);
    res.status(500).json({ message: 'Server error while fetching deposit address.' });
  }
};

// @desc    Initiate a new withdrawal request
// @route   POST /api/wallet/withdrawals
// @access  Private
exports.requestWithdrawal = async (req, res) => {
  const {
    assetId,
    recipientAddress,
    amount: amountRequestedStr,
    twoFactorCode, // We will assume this is validated by a separate middleware or service in a real app
    memo: recipientMemo
  } = req.body;
  const userId = req.user.id;

  // --- Basic Validations ---
  if (!assetId || !recipientAddress || !amountRequestedStr || !twoFactorCode) {
    return res.status(400).json({ message: 'Missing required fields (assetId, recipientAddress, amount, twoFactorCode).' });
  }

  try {
    const assetConfig = await AssetConfig.findOne({ assetId, isActive: true, canWithdraw: true });
    if (!assetConfig) {
      return res.status(404).json({ message: 'Asset not found or withdrawals are disabled for this asset.' });
    }

    // SIMULATION: For now, we'll assume 2FA is valid. In a real app, verify this first!
    // E.g., using a library like 'speakeasy' if user has 2FA setup with TOTP.
    // const is2FAValid = await verifyTwoFactorCode(userId, twoFactorCode);
    // if (!is2FAValid) { return res.status(401).json({ message: 'Invalid 2FA code.' }); }

    // --- Amount and Balance Validations (using strings, needs decimal math library for precision) ---
    // TODO: Replace string comparisons/math with a robust decimal library (e.g., Decimal.js)
    const amountRequested = parseFloat(amountRequestedStr); // TEMPORARY: Using parseFloat for now
    const withdrawalFee = parseFloat(assetConfig.withdrawalFee); // TEMPORARY
    const minWithdrawal = parseFloat(assetConfig.minWithdrawal); // TEMPORARY
    
    if (isNaN(amountRequested) || amountRequested <= 0) {
        return res.status(400).json({ message: 'Invalid withdrawal amount.' });
    }
    if (amountRequested < minWithdrawal) {
        return res.status(400).json({ message: `Withdrawal amount is less than minimum of ${minWithdrawal} ${assetConfig.symbol}.` });
    }

    let userBalance = await UserAssetBalance.findOne({ user: userId, assetId: assetConfig.assetId });
    if (!userBalance) {
        // Create a balance record if it doesn't exist (though it should ideally)
        userBalance = new UserAssetBalance({ 
            user: userId, 
            assetConfig: assetConfig._id, 
            assetId: assetConfig.assetId, 
            availableBalance: '0', 
            pendingBalance: '0' 
        });
        await userBalance.save();
    }

    const availableBalance = parseFloat(userBalance.availableBalance); // TEMPORARY

    if (amountRequested > availableBalance) {
      return res.status(400).json({ message: 'Insufficient available balance.' });
    }

    const netAmountToTransfer = amountRequested - withdrawalFee;
    if (netAmountToTransfer <= 0) {
        return res.status(400).json({ message: 'Net amount after fee is zero or less. Increase withdrawal amount.' });
    }

    // --- Create Withdrawal Request --- 
    // For a real system, this is where you'd use a transaction to ensure atomicity if deducting pending balance
    // mongoose.startSession().then(session => session.withTransaction(async () => { ... }))

    // SIMULATION: Deduct from availableBalance and move to pendingBalance (Illustrative, needs decimal math)
    // This is simplified. A robust system would use Decimal types and ensure atomic operations.
    const newAvailableBalance = availableBalance - amountRequested;
    const currentPendingBalance = parseFloat(userBalance.pendingBalance) || 0; // TEMPORARY
    const newPendingBalance = currentPendingBalance + amountRequested;

    userBalance.availableBalance = newAvailableBalance.toFixed(assetConfig.precision); // TEMPORARY
    userBalance.pendingBalance = newPendingBalance.toFixed(assetConfig.precision); // TEMPORARY
    await userBalance.save(); // In real app, use session for atomicity with withdrawal creation

    const withdrawal = new WithdrawalRequest({
      user: userId,
      assetConfig: assetConfig._id,
      assetId: assetConfig.assetId,
      recipientAddress,
      recipientMemo: assetConfig.supportsMemo ? recipientMemo : null,
      amountRequested: amountRequested.toFixed(assetConfig.precision), // TEMPORARY
      withdrawalFee: withdrawalFee.toFixed(assetConfig.precision), // TEMPORARY
      netAmountToTransfer: netAmountToTransfer.toFixed(assetConfig.precision), // TEMPORARY
      twoFactorCodeProvided: twoFactorCode, // For audit
      status: 'pending_review', // Default status
    });
    await withdrawal.save();

    res.status(202).json({
      withdrawalId: withdrawal._id,
      status: withdrawal.status,
      message: 'Withdrawal request submitted successfully and is pending review.'
    });

  } catch (error) {
    console.error('Error in requestWithdrawal:', error);
    // TODO: If balance update failed but withdrawal request was saved, or vice-versa, need rollback or reconciliation logic.
    // This is where database transactions are crucial.
    res.status(500).json({ message: 'Server error while processing withdrawal request.' });
  }
};

// TODO:
// - Endpoint to get user's withdrawal history (GET /api/wallet/withdrawals)
// - Admin endpoints to manage/approve/reject withdrawal requests
// - Webhook for deposit confirmations from blockchain listeners (updates UserAssetBalance)
// - Robust decimal arithmetic for all balance operations.
// - Real 2FA verification.
// - Real crypto address validation.
