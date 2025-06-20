const express = require('express');
const { body } = require('express-validator');
const { 
  addToCart, 
  getCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All cart routes require authentication
router.use(protect);

// Get cart
router.get('/', getCart);

// Add to cart
router.post(
  '/',
  [
    body('bookId').notEmpty().withMessage('Book ID is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  addToCart
);

// Update cart item
router.put(
  '/:id',
  [
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  updateCartItem
);

// Remove from cart
router.delete('/:id', removeFromCart);

// Clear cart
router.delete('/', clearCart);

module.exports = router;
