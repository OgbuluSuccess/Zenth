const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
  toggleUserActiveStatus,
  getUserWallet,
  adminSendMoneyToUser
} = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/auth'); // Updated path and using restrictTo

// User specific routes
router.get('/profile/:id', protect, getUserProfile); // Protect: user must be logged in, can be themselves or admin
router.put('/profile/:id', protect, updateUserProfile); // Protect: user must be logged in, can only update their own or admin can update
router.get('/wallet', protect, getUserWallet); // Get the current user's wallet balance

// Admin specific routes
router.get('/admin/all', protect, restrictTo('admin', 'superadmin'), getAllUsers);
router.post('/admin/create', protect, restrictTo('admin', 'superadmin'), createUserByAdmin);
router.put('/admin/update/:id', protect, restrictTo('admin', 'superadmin'), updateUserByAdmin);
router.delete('/admin/delete/:id', protect, restrictTo('admin', 'superadmin'), deleteUserByAdmin);
router.patch('/admin/toggle-active/:id', protect, restrictTo('admin', 'superadmin'), toggleUserActiveStatus);
router.post('/admin/send-money', protect, restrictTo('admin', 'superadmin'), adminSendMoneyToUser);

module.exports = router;
