const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to create JWT token
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // Create new user with role if provided, otherwise defaults to 'user'
    const userData = {
      name,
      email,
      password
    };
    
    // Only add role if it's provided and valid
    if (role && ['user', 'admin', 'superadmin'].includes(role)) {
      userData.role = role;
    }

    // Create new user
    const user = await User.create(userData);

    // Generate JWT token
    const token = createToken(user._id);

    // Return user data without password
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = createToken(user._id);

    // Return user data without password
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    console.log('getAllUsers function called');
    console.log('User making request:', req.user);
    
    // Select fields to return, explicitly exclude password
    const users = await User.find({}).select('-password'); 
    console.log('Users found:', users.length);
    
    // Log first user for debugging if available
    if (users.length > 0) {
      console.log('Sample user:', {
        id: users[0]._id,
        name: users[0].name,
        email: users[0].email,
        role: users[0].role
      });
    }

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
