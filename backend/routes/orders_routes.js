const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Order = require('../models/order_models');
const Product = require('../models/product_models');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, notes } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No items in cart'
            });
        }
        
        let totalAmount = 0;
        const orderItems = [];
        
        for (const item of items) {
            const product = await Product.findById(item.productId);
            
            if (!product || !product.isActive) {
                return res.status(400).json({
                    success: false,
                    message: `Product ${item.name} not available`
                });
            }
            
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${item.name}`
                });
            }
            
            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;
            
            orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.image
            });
            
            product.stock -= item.quantity;
            await product.save();
        }
        
        const order = new Order({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod,
            notes,
            paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid'
        });
        
        await order.save();
        
        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/orders/my-orders
// @desc    Get user's orders
// @access  Private
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort('-createdAt')
            .populate('items.productId', 'name image');
        
        res.json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/orders
// @desc    Get all orders (admin)
// @access  Private/Admin
router.get('/', auth, admin, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        
        let filter = {};
        if (status) filter.status = status;
        
        const skip = (page - 1) * limit;
        
        const orders = await Order.find(filter)
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit))
            .populate('user', 'name email');
        
        const total = await Order.countDocuments(filter);
        
        res.json({
            success: true,
            count: orders.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', auth, admin, async (req, res) => {
    try {
        const { status } = req.body;
        
        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }
        
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Order status updated',
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;