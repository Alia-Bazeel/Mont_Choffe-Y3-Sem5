const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// Get all products
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Get single product
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
});

// Admin CRUD
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
});

router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
});

router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
});

module.exports = router;
