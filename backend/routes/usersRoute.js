const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// Get all users (admin)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
});

module.exports = router;
