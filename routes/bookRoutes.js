const express = require('express');
const { body } = require('express-validator');
const { 
  addBook, 
  getBooks, 
  getBook, 
  updateBook, 
  deleteBook 
} = require('../controllers/bookController');
const { protect, adminOnly } = require('../middleware/auth');
const { verifyApiKey } = require('../middleware/apiKey');
const { validateRequest } = require('../middleware/validator');

const router = express.Router();

// Public route with API key verification
router.get('/', verifyApiKey, getBooks);
router.get('/:id', verifyApiKey, getBook);

// Admin-only routes
router.post(
  '/',
  [
    protect,
    adminOnly,
    body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('stockQuantity').isInt({ min: 0 }).withMessage('Stock quantity must be a positive integer'),
    validateRequest
  ],
  addBook
);

router.put(
  '/:id',
  [
    protect,
    adminOnly,
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('author').optional().notEmpty().withMessage('Author cannot be empty'),
    body('price').optional().isNumeric().withMessage('Price must be a number'),
    body('stockQuantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be a positive integer'),
    validateRequest
  ],
  updateBook
);

router.delete('/:id', [protect, adminOnly], deleteBook);

module.exports = router;
