/**
 * Mock email service for sending notifications
 * In a production environment, you would replace this with a real email service
 * like Nodemailer with SMTP or a service like SendGrid, Mailgun, etc.
 */

// Mock function to send order confirmation
exports.sendOrderConfirmation = async (user, order, orderItems) => {
  try {
    // In a real implementation, you would connect to an email service here
    console.log(`
      =================================
      ORDER CONFIRMATION EMAIL SENT
      =================================
      To: ${user.email}
      Subject: Your BookBazaar Order #${order.id} Confirmation
      
      Dear ${user.name},
      
      Thank you for your order! We've received your order and it's being processed.
      
      Order Details:
      Order ID: ${order.id}
      Order Date: ${new Date(order.createdAt).toLocaleString()}
      Total Amount: $${order.totalAmount}
      
      Shipping Address:
      ${order.shippingAddress}
      
      Contact Number:
      ${order.contactNumber}
      
      Payment Status: ${order.paymentStatus}
      
      Items:
      ${orderItems.map(item => `
        - ${item.Book.title} by ${item.Book.author}
        Quantity: ${item.quantity}
        Price: $${item.price}
        Subtotal: $${item.price * item.quantity}
      `).join('\n')}
      
      Thank you for shopping with BookBazaar!
      
      =================================
    `);
    
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
};

// Mock function to send payment confirmation
exports.sendPaymentConfirmation = async (user, order, paymentId) => {
  try {
    console.log(`
      =================================
      PAYMENT CONFIRMATION EMAIL SENT
      =================================
      To: ${user.email}
      Subject: Payment Confirmation for Order #${order.id}
      
      Dear ${user.name},
      
      We're happy to inform you that your payment for order #${order.id} has been successfully processed.
      
      Payment Details:
      Payment ID: ${paymentId}
      Amount: $${order.totalAmount}
      Date: ${new Date().toLocaleString()}
      
      Your order is now being processed for shipping.
      
      Thank you for shopping with BookBazaar!
      
      =================================
    `);
    
    return true;
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    return false;
  }
};
