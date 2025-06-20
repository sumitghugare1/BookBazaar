const express = require('express');
const { body } = require('express-validator');
const { 
  createPayment, 
  verifyPayment 
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const { verifyApiKey } = require('../middleware/apiKey');

const router = express.Router();

// All payment routes require authentication and API key
router.use(protect);
router.use(verifyApiKey);

// Create payment
router.post(
  '/create',
  [
    body('orderId').notEmpty().withMessage('Order ID is required')
  ],
  createPayment
);

// Verify payment
router.post(
  '/verify',
  [
    body('razorpay_order_id').notEmpty().withMessage('Order ID is required'),
    body('razorpay_payment_id').notEmpty().withMessage('Payment ID is required'),
    body('razorpay_signature').notEmpty().withMessage('Signature is required')
  ],
  verifyPayment
);

module.exports = router;
