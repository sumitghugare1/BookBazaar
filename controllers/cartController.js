const CartItem = require('../models/CartItem');
const Book = require('../models/Book');

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { bookId, quantity = 1 } = req.body;
    const userId = req.user.id;
    
    // Check if book exists
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    // Check if there is sufficient stock
    if (book.stockQuantity < quantity) {
      return res.status(400).json({
        success: false,
        error: `Insufficient stock. Available: ${book.stockQuantity}`
      });
    }
    
    // Check if item already in cart
    let cartItem = await CartItem.findOne({
      where: { userId, bookId }
    });
    
    if (cartItem) {
      // Update quantity
      cartItem = await cartItem.update({
        quantity: quantity
      });
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        userId,
        bookId,
        quantity
      });
    }
    
    res.status(200).json({
      success: true,
      data: cartItem
    });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to add item to cart'
    });
  }
};

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [{ model: Book }]
    });
    
    // Calculate total
    let total = 0;
    cartItems.forEach(item => {
      total += item.Book.price * item.quantity;
    });
    
    res.status(200).json({
      success: true,
      count: cartItems.length,
      total,
      data: cartItems
    });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cart'
    });
  }
};

// Update cart item
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const userId = req.user.id;
    const cartItemId = req.params.id;
    
    // Find cart item
    let cartItem = await CartItem.findOne({
      where: { id: cartItemId, userId },
      include: [{ model: Book }]
    });
    
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }
    
    // Check stock
    if (quantity > cartItem.Book.stockQuantity) {
      return res.status(400).json({
        success: false,
        error: `Insufficient stock. Available: ${cartItem.Book.stockQuantity}`
      });
    }
    
    // Update quantity
    cartItem = await cartItem.update({ quantity });
    
    res.status(200).json({
      success: true,
      data: cartItem
    });
  } catch (err) {
    console.error('Update cart item error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update cart item'
    });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.id;
    
    // Find cart item
    const cartItem = await CartItem.findOne({
      where: { id: cartItemId, userId }
    });
    
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }
    
    // Delete cart item
    await cartItem.destroy();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to remove item from cart'
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Delete all cart items for user
    await CartItem.destroy({
      where: { userId }
    });
    
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: {}
    });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cart'
    });
  }
};
