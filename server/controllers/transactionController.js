const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Get all transactions (Admin)
exports.getAllTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = {};
    
    // Apply filters if provided
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.userId) filter.user = req.query.userId;
    
    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }
    
    const transactions = await Transaction.find(filter)
      .populate('user', 'name email')
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Transaction.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: transactions
    });
  } catch (error) {
    console.error('Error getting all transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get user transactions
exports.getUserTransactions = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = { user: userId };
    
    // Apply filters if provided
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;
    
    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }
    
    const transactions = await Transaction.find(filter)
      .populate('performedBy', 'name role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Transaction.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: transactions
    });
  } catch (error) {
    console.error('Error getting user transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get current user's transactions
exports.getMyTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = { user: userId };
    
    // Apply filters if provided
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;
    
    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }
    
    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Transaction.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: transactions
    });
  } catch (error) {
    console.error('Error getting my transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create a transaction (Admin)
exports.createTransaction = async (req, res) => {
  try {
    const { userId, type, amount, description, status } = req.body;
    
    // Validate inputs
    if (!userId || !type || !amount) {
      return res.status(400).json({
        success: false,
        message: 'User ID, type, and amount are required'
      });
    }
    
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }
    
    // Find the user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Create transaction
    const transaction = new Transaction({
      user: userId,
      type,
      amount,
      description: description || `${type} transaction`,
      status: status || 'completed',
      performedBy: req.user.id
    });
    
    // Update user wallet if transaction is completed
    if (transaction.status === 'completed') {
      // Initialize wallet if it doesn't exist
      if (!user.wallet) {
        user.wallet = { balance: 0, currency: 'USD' };
      }
      
      // Update wallet balance based on transaction type
      if (['deposit', 'profit', 'referral', 'bonus', 'admin'].includes(type)) {
        user.wallet.balance += parseFloat(amount);
      } else if (type === 'withdrawal') {
        // Check if user has enough balance
        if (user.wallet.balance < amount) {
          return res.status(400).json({
            success: false,
            message: 'Insufficient balance'
          });
        }
        user.wallet.balance -= parseFloat(amount);
      }
      
      await user.save();
    }
    
    await transaction.save();
    
    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update transaction status (Admin)
exports.updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;
    
    // Validate inputs
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    // Find the transaction
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    // Get the previous status
    const previousStatus = transaction.status;
    
    // Update transaction
    transaction.status = status;
    if (adminNote) transaction.adminNote = adminNote;
    transaction.updatedAt = Date.now();
    
    // Find the user
    const user = await User.findById(transaction.user);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update user wallet if status changed to or from 'completed'
    if (previousStatus !== 'completed' && status === 'completed') {
      // Initialize wallet if it doesn't exist
      if (!user.wallet) {
        user.wallet = { balance: 0, currency: 'USD' };
      }
      
      // Update wallet balance based on transaction type
      if (['deposit', 'profit', 'referral', 'bonus', 'admin'].includes(transaction.type)) {
        user.wallet.balance += parseFloat(transaction.amount);
      } else if (transaction.type === 'withdrawal') {
        // Check if user has enough balance
        if (user.wallet.balance < transaction.amount) {
          return res.status(400).json({
            success: false,
            message: 'Insufficient balance'
          });
        }
        user.wallet.balance -= parseFloat(transaction.amount);
      }
      
      await user.save();
    } else if (previousStatus === 'completed' && status !== 'completed') {
      // Reverse the transaction if it was previously completed
      if (!user.wallet) {
        user.wallet = { balance: 0, currency: 'USD' };
      }
      
      // Reverse wallet balance based on transaction type
      if (['deposit', 'profit', 'referral', 'bonus', 'admin'].includes(transaction.type)) {
        // Check if user has enough balance
        if (user.wallet.balance < transaction.amount) {
          return res.status(400).json({
            success: false,
            message: 'Cannot reverse transaction, insufficient balance'
          });
        }
        user.wallet.balance -= parseFloat(transaction.amount);
      } else if (transaction.type === 'withdrawal') {
        user.wallet.balance += parseFloat(transaction.amount);
      }
      
      await user.save();
    }
    
    await transaction.save();
    
    res.status(200).json({
      success: true,
      message: 'Transaction status updated successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Error updating transaction status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get transaction statistics (Admin)
exports.getTransactionStats = async (req, res) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
    
    // Ensure end date is set to the end of the day
    endDate.setHours(23, 59, 59, 999);
    
    const stats = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);
    
    // Calculate total deposits and withdrawals
    const deposits = stats.find(item => item._id === 'deposit') || { count: 0, totalAmount: 0 };
    const withdrawals = stats.find(item => item._id === 'withdrawal') || { count: 0, totalAmount: 0 };
    
    // Get daily transaction data for chart
    const dailyData = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            type: '$type'
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);
    
    // Format daily data for chart
    const chartData = {};
    dailyData.forEach(item => {
      const { date, type } = item._id;
      if (!chartData[date]) {
        chartData[date] = { date };
      }
      chartData[date][type] = item.totalAmount;
    });
    
    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalDeposits: deposits.totalAmount,
          depositCount: deposits.count,
          totalWithdrawals: withdrawals.totalAmount,
          withdrawalCount: withdrawals.count,
          netFlow: deposits.totalAmount - withdrawals.totalAmount
        },
        byType: stats,
        chartData: Object.values(chartData)
      }
    });
  } catch (error) {
    console.error('Error getting transaction stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
