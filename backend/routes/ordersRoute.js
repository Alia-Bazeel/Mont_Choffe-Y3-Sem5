const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const verifyToken = require('../middleware/verifyToken');

// Create order
router.post('/', verifyToken, async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
        const order = new Order({
            userId: req.user.id,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod
        });
        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get orders for user
router.get('/', verifyToken, async (req, res) => {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
});

// Admin: get all orders
router.get('/all', verifyToken, async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access only' });
    const orders = await Order.find();
    res.json(orders);
});

module.exports = router;
