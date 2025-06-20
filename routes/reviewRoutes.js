const express = require('express');
const { body } = require('express-validator');
const { 
  addReview, 
  getBookReviews, 
  deleteReview 
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { verifyApiKey } = require('../middleware/apiKey');

const router = express.Router();

// Book reviews routes
router.post(
  '/books/:bookId/reviews',
  [
    protect,
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
  ],
  addReview
);

router.get('/books/:bookId/reviews', verifyApiKey, getBookReviews);

// Delete review (owner or admin only)
router.delete('/reviews/:id', protect, deleteReview);

module.exports = router;
