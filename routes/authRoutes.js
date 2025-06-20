const express = require('express');
const { body } = require('express-validator');
const { register, login, generateApiKey, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validator');

const router = express.Router();

// Register user
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validateRequest
  ],
  register
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validateRequest
  ],
  login
);

// Generate API key (protected)
router.post('/api-key', protect, generateApiKey);

// Get current user (protected)
router.get('/me', protect, getMe);

module.exports = router;
