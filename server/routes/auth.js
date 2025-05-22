const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/auth'); // Added restrictTo

// Register and login routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route to get current user
router.get('/me', protect, authController.getCurrentUser);

// Admin route to get all users
router.get('/all-users', protect, restrictTo('admin', 'superadmin'), authController.getAllUsers); // Added 'superadmin' as well, adjust if needed

module.exports = router;
