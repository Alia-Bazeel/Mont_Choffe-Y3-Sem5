// routes/orders.js - CORRECT VERSION
const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/authMiddleware'); // Updated middleware

const router = express.Router();

// Regular users can create orders
router.post('/', auth, async (req, res) => {
  try {
    console.log('Creating order for user:', req.userId);

    const { items, totalAmount, customerInfo, deliveryInfo, paymentMethod } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items are required'
      });
    }

    if (!totalAmount || typeof totalAmount !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Valid total amount is required'
      });
    }

    if (!customerInfo || typeof customerInfo !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Customer information is required'
      });
    }

    if (!deliveryInfo || typeof deliveryInfo !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Delivery information is required'
      });
    }

    // Create order
    const orderData = {
      user: req.userId, // From auth middleware
      items,
      totalAmount,
      customerInfo,
      deliveryInfo,
      paymentMethod: paymentMethod || 'cod'
    };

    console.log('Creating order with data:', orderData);

    const order = await Order.create(orderData);

    console.log('Order created:', order._id);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error('Order creation failed:', error.message);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
});

module.exports = router;