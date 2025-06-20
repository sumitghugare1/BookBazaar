const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Order } = require('../models/Order');
const User = require('../models/User');
const emailService = require('../utils/emailService');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create a payment order
exports.createPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    // Find the order
    const order = await Order.findOne({
      where: {
        id: orderId,
        userId: req.user.id
      }
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    if (order.paymentStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Payment already processed for this order'
      });
    }
    
    // Create Razorpay order
    const payment = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: `receipt_${order.id}`,
      notes: {
        orderId: order.id,
        userId: req.user.id
      }
    });
    
    // Update order with payment ID
    await order.update({
      paymentId: payment.id
    });
    
    res.status(200).json({
      success: true,
      data: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        receipt: payment.receipt,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (err) {
    console.error('Create payment error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment'
    });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature 
    } = req.body;
    
    // Find order by payment ID
    const order = await Order.findOne({
      where: {
        paymentId: razorpay_order_id
      }
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    
    if (generated_signature !== razorpay_signature) {
      // Update order status to failed
      await order.update({
        paymentStatus: 'failed'
      });
      
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });
    }
    
    // Update order status
    await order.update({
      paymentStatus: 'completed',
      status: 'processing'
    });
    
    // Send payment confirmation email
    const user = await User.findByPk(order.userId);
    await emailService.sendPaymentConfirmation(user, order, razorpay_payment_id);
    
    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        paymentId: razorpay_payment_id,
        orderId: order.id
      }
    });
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to verify payment'
    });
  }
};
