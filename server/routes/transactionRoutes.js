const express = require('express');
const router = express.Router();
const {
  getAllTransactions,
  getUserTransactions,
  getMyTransactions,
  createTransaction,
  updateTransactionStatus,
  getTransactionStats
} = require('../controllers/transactionController');
const { protect, restrictTo } = require('../middleware/auth');

// User routes
router.get('/me', protect, getMyTransactions);

// Admin routes
router.get('/admin/all', protect, restrictTo('admin', 'superadmin'), getAllTransactions);
router.get('/admin/user/:userId', protect, restrictTo('admin', 'superadmin'), getUserTransactions);
router.post('/admin/create', protect, restrictTo('admin', 'superadmin'), createTransaction);
router.patch('/admin/status/:id', protect, restrictTo('admin', 'superadmin'), updateTransactionStatus);
router.get('/admin/stats', protect, restrictTo('admin', 'superadmin'), getTransactionStats);

module.exports = router;
