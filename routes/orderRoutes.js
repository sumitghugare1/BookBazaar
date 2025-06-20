const express = require('express');
const { body } = require('express-validator');
const { 
  createOrder, 
  getUserOrders, 
  getOrder 
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { verifyApiKey } = require('../middleware/apiKey');

const router = express.Router();

// All order routes require authentication
router.use(protect);
router.use(verifyApiKey);

// Create order
router.post(
  '/',
  [
    body('items').isArray().withMessage('Items must be an array'),
    body('items.*.bookId').notEmpty().withMessage('Book ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
    body('contactNumber').notEmpty().withMessage('Contact number is required')
  ],
  createOrder
);

// Get user orders
router.get('/', getUserOrders);

// Get single order
router.get('/:id', getOrder);

module.exports = router;
