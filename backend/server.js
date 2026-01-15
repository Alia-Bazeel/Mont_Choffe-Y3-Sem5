const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5500', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB Atlas Connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// SIMPLE ADMIN LOGIN (from .env only)
app.post('/api/auth/admin-login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Admin login attempt:', { username });
    
    // Get credentials from .env
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    // Check if .env has credentials
    if (!adminEmail || !adminPassword) {
      console.error('Missing admin credentials in .env');
      console.error('ADMIN_EMAIL:', adminEmail || 'NOT SET');
      console.error('ADMIN_PASSWORD:', adminPassword ? 'SET' : 'NOT SET');
      
      return res.status(500).json({
        success: false,
        message: 'Admin system not configured. Please check server configuration.'
      });
    }
    
    // Verify credentials
    if (username === adminEmail && password === adminPassword) {
      console.log('Admin login successful for:', username);
      
      // Generate simple admin token (base64 encoded "email:timestamp")
      const adminToken = Buffer.from(`${adminEmail}:${Date.now()}`).toString('base64');
      
      res.json({ 
        success: true, 
        token: adminToken,
        message: 'Admin login successful',
        user: {
          email: adminEmail,
          name: 'Admin User',
          role: 'admin'
        }
      });
    } else {
      console.log('Invalid admin credentials attempt');
      res.status(401).json({ 
        success: false, 
        message: 'Invalid admin credentials' 
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin login'
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});