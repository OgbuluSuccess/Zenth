const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user'
  },
  profilePicture: {
    type: String,
    default: ''
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true // Allows null/undefined values to not trigger uniqueness constraint
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  wallet: {
    balance: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  totalInvested: {
    type: Number,
    default: 0
  },
  totalProfit: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (this.isModified('password')) {
    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  // Generate a unique referral code for new users
  if (this.isNew && !this.referralCode) {
    // Generate a referral code based on name and random string
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const namePrefix = this.name.substring(0, 3).toUpperCase();
    this.referralCode = `${namePrefix}-${randomStr}`;
  }
  
  // Update the updatedAt timestamp
  this.updatedAt = Date.now();
  
  next();
});

// Method to check if password is correct
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate a unique referral code before saving
UserSchema.pre('save', async function(next) {
  // Only generate a referral code if one doesn't exist
  if (!this.referralCode) {
    // Generate a unique referral code based on timestamp and random string
    const timestamp = Date.now().toString().slice(-6);
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.referralCode = `${timestamp}${randomStr}`;
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
