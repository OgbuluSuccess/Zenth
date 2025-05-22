const User = require('../models/User');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // Exclude password
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      // Return a cleaned user object, excluding password explicitly if .select didn't catch it or for safety
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive, // Include isActive status
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user profile (for user updating their own profile)
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, profilePicture } = req.body;
    const userIdToUpdate = req.params.id;
    const requestingUserId = req.user.id;

    // Check if user is updating their own profile OR if an admin is doing it
    // Note: Admins should preferably use the updateUserByAdmin for broader changes.
    if (userIdToUpdate !== requestingUserId && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this profile'
      });
    }

    const user = await User.findById(userIdToUpdate);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Users can only update their name, email, and profilePicture via this route.
    // Role and isActive status changes are for admins via updateUserByAdmin.
    if (name) user.name = name;
    if (email) user.email = email;
    if (profilePicture) user.profilePicture = profilePicture;
    user.updatedAt = Date.now();

    const updatedUser = await user.save();

    // Don't send password back
    const userResponse = { ...updatedUser._doc };
    delete userResponse.password;

    res.status(200).json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all users (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    // Ensure only admin or superadmin can access
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    const users = await User.find().select('-password'); // Exclude password
    res.status(200).json({
      success: true,
      count: users.length,
      users // users will already be an array of user objects without passwords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create user (Admin)
exports.createUserByAdmin = async (req, res) => {
  try {
    // Ensure only admin or superadmin can access
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    const { name, email, password, role, isActive } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password, // Password will be hashed by the 'save' pre-hook in User model
      role: role || 'user', // Default to 'user' if not provided
      isActive: typeof isActive === 'boolean' ? isActive : true // Default to true if not provided
    });
    await user.save();

    // Don't send password back
    const userResponse = { ...user._doc };
    delete userResponse.password;

    res.status(201).json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user by ID (Admin)
exports.updateUserByAdmin = async (req, res) => {
  try {
    // Ensure only admin or superadmin can access
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    const { name, email, role, isActive } = req.body;
    const userIdToUpdate = req.params.id;

    const user = await User.findById(userIdToUpdate);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent unauthorized role changes or modifications to superadmin by admin
    if (user.role === 'superadmin' && req.user.id !== user.id.toString()) {
        // Admin trying to modify another superadmin
        if (req.user.role === 'admin') {
             return res.status(403).json({ success: false, message: 'Admins cannot modify superadmin accounts.'});
        }
        // Superadmin trying to change another superadmin's role
        if (role && role !== 'superadmin') {
            return res.status(403).json({ success: false, message: 'Superadmin role cannot be changed by another superadmin.'});
        }
    }
    // Superadmin trying to change their own role to something other than superadmin
    if (user.role === 'superadmin' && req.user.id === user.id.toString() && role && role !== 'superadmin') {
        return res.status(403).json({ success: false, message: 'Superadmin cannot change their own role from superadmin.'});
    }
    // Admin trying to escalate a user to superadmin or change a superadmin's role
    if (req.user.role === 'admin' && ( (role === 'superadmin' && user.role !== 'superadmin') || (user.role === 'superadmin' && role && role !== 'superadmin') ) ){
        return res.status(403).json({ success: false, message: 'Admins cannot assign or change superadmin role.'});
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    // Only allow role change if it's not violating rules above
    if (role) user.role = role; 
    if (typeof isActive === 'boolean') {
        // Prevent deactivation of self if superadmin or deactivation of superadmin by admin
        if (user.role === 'superadmin' && !isActive) {
            if (req.user.id === user.id.toString()) {
                return res.status(403).json({ success: false, message: 'Superadmin cannot deactivate themselves.'});
            }
            if (req.user.role === 'admin') {
                 return res.status(403).json({ success: false, message: 'Admin cannot deactivate superadmin.'});
            }
        }
        user.isActive = isActive;
    }
    user.updatedAt = Date.now();

    const updatedUser = await user.save();
    
    // Don't send password back
    const userResponse = { ...updatedUser._doc };
    delete userResponse.password;

    res.status(200).json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete user by ID (Admin)
exports.deleteUserByAdmin = async (req, res) => {
  try {
    // Ensure only admin or superadmin can access
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    const userIdToDelete = req.params.id;
    const user = await User.findById(userIdToDelete);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deletion of superadmin, or superadmin deleting themselves
    if (user.role === 'superadmin') {
         if (req.user.id === user.id.toString()) {
            return res.status(403).json({ success: false, message: 'Superadmin cannot delete themselves.'});
         }
         // Allow superadmin to delete other superadmins (if business logic permits, otherwise add check for req.user.role === 'superadmin' to disallow)
         if (req.user.role === 'admin') { // Admin cannot delete superadmin
            return res.status(403).json({ success: false, message: 'Admin cannot delete superadmin.'});
         }
    }
    
    await User.findByIdAndDelete(userIdToDelete);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Toggle user active status (Admin) - This function is largely covered by updateUserByAdmin
// but can be kept for a dedicated endpoint if desired. If so, similar role/superadmin checks apply.
// For simplicity, we can recommend using updateUserByAdmin with the isActive flag.
// However, if a distinct toggle is required:
exports.toggleUserActiveStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Only admins can toggle user status
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to perform this action'
      });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent deactivating superadmins
    if (user.role === 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Superadmin accounts cannot be deactivated'
      });
    }
    
    // Prevent regular admins from deactivating other admins
    if (user.role === 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to deactivate admin accounts'
      });
    }
    
    // Toggle the active status
    user.isActive = !user.isActive;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user wallet balance
exports.getUserWallet = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        balance: user.wallet?.balance || 0,
        currency: user.wallet?.currency || 'USD'
      }
    });
  } catch (error) {
    console.error('Error getting user wallet:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Admin: Send money to user account
exports.adminSendMoneyToUser = async (req, res) => {
  try {
    const { userId, amount, description } = req.body;
    
    // Validate inputs
    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'User ID and amount are required'
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
    
    // Initialize wallet if it doesn't exist
    if (!user.wallet) {
      user.wallet = { balance: 0, currency: 'USD' };
    }
    
    // Add the amount to the user's wallet
    user.wallet.balance += parseFloat(amount);
    
    // Add transaction record if the user has a transactions array
    if (Array.isArray(user.transactions)) {
      user.transactions.push({
        type: 'deposit',
        amount: parseFloat(amount),
        description: description || 'Admin deposit',
        status: 'completed',
        date: new Date()
      });
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: `Successfully sent $${amount} to ${user.name}`,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        transaction: {
          amount: parseFloat(amount),
          newBalance: user.wallet.balance,
          timestamp: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Error sending money to user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
