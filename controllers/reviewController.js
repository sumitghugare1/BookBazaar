const Review = require('../models/Review');
const Book = require('../models/Book');
const User = require('../models/User');

// Add a review to a book
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { bookId } = req.params;
    const userId = req.user.id;
    
    // Check if book exists
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    // Check if user has already reviewed this book
    const existingReview = await Review.findOne({
      where: { userId, bookId }
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this book'
      });
    }
    
    // Create review
    const review = await Review.create({
      userId,
      bookId,
      rating,
      comment
    });
    
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (err) {
    console.error('Add review error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to add review'
    });
  }
};

// Get all reviews for a book
exports.getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params;
    
    // Check if book exists
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    // Get reviews with user information
    const reviews = await Review.findAll({
      where: { bookId },
      include: [
        {
          model: User,
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (err) {
    console.error('Get reviews error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews'
    });
  }
};

// Delete a review (owner or admin only)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    // Check if user is the owner or an admin
    if (review.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this review'
      });
    }
    
    await review.destroy();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Delete review error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete review'
    });
  }
};
