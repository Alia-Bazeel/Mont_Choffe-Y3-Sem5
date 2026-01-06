const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Contact = require('../models/contact_models');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST /api/contact
// @desc    Send contact message
// @access  Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('message', 'Message is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const { name, email, phone, subject, message } = req.body;

        const contact = new Contact({
            name,
            email,
            phone,
            subject,
            message
        });

        await contact.save();

        res.status(201).json({
            success: true,
            message: 'Message sent successfully!',
            contact: {
                id: contact._id,
                name: contact.name,
                email: contact.email
            }
        });
    } catch (error) {
        console.error('Contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message'
        });
    }
});

// @route   GET /api/contact
// @desc    Get all contact messages (admin)
// @access  Private/Admin
router.get('/', auth, admin, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        
        let filter = {};
        if (status) filter.status = status;
        
        const skip = (page - 1) * limit;
        
        const messages = await Contact.find(filter)
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Contact.countDocuments(filter);
        
        res.json({
            success: true,
            count: messages.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            messages
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