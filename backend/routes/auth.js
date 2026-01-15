const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// ========== ADMIN LOGIN ==========
router.post('/admin-login', async (req, res) => {
  console.log('=== ADMIN LOGIN START ===');
  console.log('Request body:', req.body);
  
  try {
    const { username, password } = req.body;

    // Check if credentials provided
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    // Get admin credentials from .env
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@montchoffe.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

    console.log('Checking against:', { adminEmail });
    console.log('Provided:', { username, password });

    // Check credentials
    if (username !== adminEmail || password !== adminPassword) {
      console.log('Invalid admin credentials');
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Generate admin token (base64 encoded for auth middleware)
    const timestamp = Date.now();
    const tokenString = `${adminEmail}:${timestamp}`;
    const adminToken = Buffer.from(tokenString).toString('base64');

    console.log('Admin login successful');
    console.log('Generated token:', adminToken);

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token: adminToken,
      user: {
        id: 'admin',
        email: adminEmail,
        name: 'Administrator',
        role: 'admin'
      }
    });
    
    console.log('=== ADMIN LOGIN COMPLETE ===');
    
  } catch (error) {
    console.error('=== ADMIN LOGIN ERROR ===');
    console.error('Error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Admin login failed',
      error: error.message
    });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  console.log('=== REGISTRATION START ===');
  console.log('Request body:', req.body);
  
  try {
    const { name, email, password} = req.body;

    console.log('1. Validating input...');
    if (!name || !email || !password) {
      console.log('Missing fields');
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    console.log('2. Checking if user exists...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    console.log('3. Creating user object...');
    const userData = {
      name,
      email,
      password,
      phone: 'Not provided'  // Explicitly provide default
    };
    console.log('User data to create:', userData);

    console.log('4. Saving user...');
    const user = await User.create(userData);
    console.log('5. User created successfully:', user._id);

    // Generate token
    const token = generateToken(user._id);

    console.log('6. Sending success response...');
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
    console.log('=== REGISTRATION COMPLETE ===');
    
  } catch (error) {
    console.error('=== REGISTRATION ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    if (error.code === 11000) {
      console.error('Duplicate key error for email');
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed',
      error: error.message 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password provided
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Login failed', 
      error: error.message 
    });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Not authorized', 
      error: error.message 
    });
  }
});

module.exports = router;