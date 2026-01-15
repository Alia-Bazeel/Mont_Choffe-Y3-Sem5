// routes/admin.js - UPDATED VERSION
const express = require('express');
const auth = require('../middleware/authMiddleware');
const Order = require('../models/Order');

const router = express.Router();

// Admin middleware - check if req.isAdmin is true
const requireAdmin = (req, res, next) => {
  console.log('Admin check - isAdmin:', req.isAdmin);
  if (req.isAdmin) {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
};

// ========== DASHBOARD STATS ==========
router.get('/dashboard', auth, requireAdmin, async (req, res) => {
  try {
    console.log('Dashboard requested by:', req.user?.email);
    
    // Get counts
    const totalOrders = await Order.countDocuments();
    console.log('Total orders:', totalOrders);
    
    // Get revenue from delivered orders
    const revenueResult = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    console.log('Total revenue:', totalRevenue);
    
    // Get pending orders
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    console.log('Pending orders:', pendingOrders);
    
    // Get delivered orders count for stats
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    
    // Recent orders - NO populate if no user system
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber customerInfo totalAmount status items createdAt');
    
    console.log('Recent orders found:', recentOrders.length);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        deliveredOrders, // Added for frontend
        recentOrders: recentOrders.map(order => ({
          _id: order._id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          status: order.status || 'pending',
          createdAt: order.createdAt,
          customerInfo: order.customerInfo || {},
          items: order.items || []
        }))
      }
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to load dashboard',
      error: error.message 
    });
  }
});

// ========== ORDERS MANAGEMENT ==========
router.get('/orders', auth, requireAdmin, async (req, res) => {
  try {
    console.log('Orders requested by:', req.user?.email);
    
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .select('orderNumber customerInfo totalAmount status items deliveryInfo createdAt');
    
    console.log('Orders found:', orders.length);

    res.status(200).json({
      success: true,
      orders: orders.map(order => ({
        _id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status || 'pending',
        createdAt: order.createdAt,
        customerInfo: order.customerInfo || {},
        items: order.items || [],
        deliveryInfo: order.deliveryInfo || {}
      }))
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch orders',
      error: error.message 
    });
  }
});

// Get single order details
router.get('/orders/:id', auth, requireAdmin, async (req, res) => {
  try {
    console.log('Order details requested for:', req.params.id);
    
    const order = await Order.findById(req.params.id)
      .select('orderNumber customerInfo totalAmount status items deliveryInfo paymentMethod createdAt');
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    console.log('Order found:', order.orderNumber);

    res.status(200).json({
      success: true,
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status || 'pending',
        createdAt: order.createdAt,
        customerInfo: order.customerInfo || {},
        items: order.items || [],
        deliveryInfo: order.deliveryInfo || {},
        paymentMethod: order.paymentMethod || 'cod'
      }
    });
  } catch (error) {
    console.error('Order details error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch order details',
      error: error.message 
    });
  }
});

// Update order status
router.patch('/orders/:id/status', auth, requireAdmin, async (req, res) => {
  try {
    console.log('Status update requested for:', req.params.id);
    console.log('New status:', req.body.status);
    
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'processing', 'out-for-delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        updatedAt: Date.now(),
        ...(status === 'delivered' ? { deliveredAt: Date.now() } : {})
      },
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }
    
    console.log('Status updated:', order.orderNumber, '->', order.status);

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update status',
      error: error.message 
    });
  }
});

module.exports = router;