const { sequelize } = require('../config/db');
const { Order, OrderItem } = require('../models/Order');
const Book = require('../models/Book');
const User = require('../models/User');
const emailService = require('../utils/emailService');

// Create a new order
exports.createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { 
      items, 
      shippingAddress,
      contactNumber 
    } = req.body;
    
    const userId = req.user.id;
    
    // Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide valid order items'
      });
    }
    
    // Extract book IDs for querying
    const bookIds = items.map(item => item.bookId);
    
    // Get all books in the order
    const books = await Book.findAll({
      where: { id: bookIds },
      transaction
    });
    
    // Map books by ID for easier lookup
    const bookMap = books.reduce((map, book) => {
      map[book.id] = book;
      return map;
    }, {});
    
    // Validate all books exist and have sufficient stock
    for (const item of items) {
      const book = bookMap[item.bookId];
      
      if (!book) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: `Book with ID ${item.bookId} not found`
        });
      }
      
      if (book.stockQuantity < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for book: ${book.title}. Available: ${book.stockQuantity}`
        });
      }
    }
    
    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      const book = bookMap[item.bookId];
      totalAmount += book.price * item.quantity;
    }
    
    // Create order
    const order = await Order.create({
      userId,
      totalAmount,
      shippingAddress,
      contactNumber,
      status: 'pending',
      paymentStatus: 'pending'
    }, { transaction });
    
    // Create order items
    const orderItems = [];
    for (const item of items) {
      const book = bookMap[item.bookId];
      
      // Create order item
      const orderItem = await OrderItem.create({
        orderId: order.id,
        bookId: item.bookId,
        quantity: item.quantity,
        price: book.price
      }, { transaction });
      
      // Include book details in order item for email
      orderItem.Book = book;
      orderItems.push(orderItem);
      
      // Update book stock
      await book.update({
        stockQuantity: book.stockQuantity - item.quantity
      }, { transaction });
    }
    
    await transaction.commit();
    
    // Send order confirmation email
    const user = await User.findByPk(userId);
    await emailService.sendOrderConfirmation(user, order, orderItems);
    
    res.status(201).json({
      success: true,
      data: {
        order,
        items: orderItems
      }
    });
  } catch (err) {
    await transaction.rollback();
    console.error('Create order error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: [{ model: Book }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
};

// Get a single order by ID
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      },
      include: [
        {
          model: OrderItem,
          include: [{ model: Book }]
        }
      ]
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
};
