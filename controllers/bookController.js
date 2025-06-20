const { Op } = require('sequelize');
const Book = require('../models/Book');

// Add a new book (Admin only)
exports.addBook = async (req, res) => {
  try {
    const { title, author, description, isbn, price, genre, publisher, publishedDate, stockQuantity, imageUrl } = req.body;
    
    // Check if book with ISBN already exists
    if (isbn) {
      const existingBook = await Book.findOne({ where: { isbn } });
      if (existingBook) {
        return res.status(400).json({
          success: false,
          error: 'Book with this ISBN already exists'
        });
      }
    }
    
    // Create new book
    const book = await Book.create({
      title,
      author,
      description,
      isbn,
      price,
      genre,
      publisher,
      publishedDate,
      stockQuantity,
      imageUrl
    });
    
    res.status(201).json({
      success: true,
      data: book
    });
  } catch (err) {
    console.error('Add book error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to add book'
    });
  }
};

// Get all books with filters and pagination
exports.getBooks = async (req, res) => {
  try {
    // Extract query parameters
    const { 
      title, 
      author, 
      genre, 
      minPrice, 
      maxPrice, 
      sortBy = 'title', 
      sortOrder = 'ASC',
      page = 1, 
      limit = 10 
    } = req.query;
    
    // Build filter conditions
    const whereConditions = {};
    
    if (title) whereConditions.title = { [Op.iLike]: `%${title}%` };
    if (author) whereConditions.author = { [Op.iLike]: `%${author}%` };
    if (genre) whereConditions.genre = { [Op.iLike]: `%${genre}%` };
    
    // Price range filter
    if (minPrice || maxPrice) {
      whereConditions.price = {};
      if (minPrice) whereConditions.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereConditions.price[Op.lte] = parseFloat(maxPrice);
    }
    
    // Calculate pagination values
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;
    
    // Validate sort parameters
    const validSortFields = ['title', 'author', 'price', 'publishedDate', 'createdAt'];
    const validSortOrders = ['ASC', 'DESC'];
    
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'title';
    const finalSortOrder = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';
    
    // Execute query with filters, sorting and pagination
    const { count, rows: books } = await Book.findAndCountAll({
      where: whereConditions,
      order: [[finalSortBy, finalSortOrder]],
      limit: limitNum,
      offset: offset
    });
    
    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      data: books
    });
  } catch (err) {
    console.error('Get books error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch books'
    });
  }
};

// Get a single book by ID
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: book
    });
  } catch (err) {
    console.error('Get book error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch book'
    });
  }
};

// Update a book (Admin only)
exports.updateBook = async (req, res) => {
  try {
    const { title, author, description, isbn, price, genre, publisher, publishedDate, stockQuantity, imageUrl } = req.body;
    
    let book = await Book.findByPk(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    // Check ISBN uniqueness if it's being updated
    if (isbn && isbn !== book.isbn) {
      const existingBook = await Book.findOne({ where: { isbn } });
      if (existingBook) {
        return res.status(400).json({
          success: false,
          error: 'Book with this ISBN already exists'
        });
      }
    }
    
    // Update book
    book = await book.update({
      title,
      author,
      description,
      isbn,
      price,
      genre,
      publisher,
      publishedDate,
      stockQuantity,
      imageUrl
    });
    
    res.status(200).json({
      success: true,
      data: book
    });
  } catch (err) {
    console.error('Update book error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update book'
    });
  }
};

// Delete a book (Admin only)
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    await book.destroy();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Delete book error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete book'
    });
  }
};
