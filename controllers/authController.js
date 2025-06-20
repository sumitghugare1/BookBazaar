const User = require('../models/User');
const ApiKey = require('../models/ApiKey');
const { generateToken } = require('../utils/jwtUtils');
const { generateApiKey } = require('../utils/apiKeyGenerator');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
};

// Generate API key
exports.generateApiKey = async (req, res) => {
  try {
    const userId = req.user.id;
    const key = generateApiKey();
    
    // Set expiry to 90 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);

    // Create API key
    const apiKey = await ApiKey.create({
      key,
      userId,
      expiresAt
    });

    res.status(201).json({
      success: true,
      apiKey: key,
      expiresAt: apiKey.expiresAt
    });
  } catch (err) {
    console.error('API key generation error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to generate API key'
    });
  }
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get user's API keys
    const apiKeys = await ApiKey.findAll({
      where: { userId: user.id, isActive: true },
      attributes: ['key', 'createdAt', 'expiresAt']
    });

    res.status(200).json({
      success: true,
      user,
      apiKeys
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile'
    });
  }
};
