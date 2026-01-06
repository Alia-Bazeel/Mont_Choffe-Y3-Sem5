const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/user');

// @route   GET /api/users
// @desc    Get all users (admin)
// @access  Private/Admin
router.get('/', auth, admin, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort('-createdAt');
        
        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }
        
        const updates = req.body;
        
        if (updates.role && req.user.role !== 'admin') {
            delete updates.role;
        }
        
        delete updates.password;
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user
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