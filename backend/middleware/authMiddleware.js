// middleware/authMiddleware.js - COMPLETE VERSION
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    console.log('Auth middleware triggered');
    console.log('Authorization header:', req.headers.authorization);
    
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('No token provided - allowing as guest');
      req.user = null;
      req.userId = null;
      req.isAdmin = false;
      return next();
    }

    console.log('Token found, checking type...');
    
    // FIRST: Try to decode as admin token (base64)
    try {
      const decodedString = Buffer.from(token, 'base64').toString('utf-8');
      console.log('Base64 decoded:', decodedString);
      
      const adminUsername = process.env.ADMIN_EMAIL || 'admin@example.com';
      
      if (decodedString.startsWith(adminUsername + ':')) {
        console.log('Valid admin token detected');
        
        // Check token expiration (optional - 24 hours)
        const timestamp = parseInt(decodedString.split(':')[1]);
        const tokenAge = Date.now() - timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (tokenAge > maxAge) {
          console.log('Admin token expired');
          return res.status(401).json({
            success: false,
            message: 'Admin token expired. Please login again.'
          });
        }
        
        // Set admin data
        req.user = {
          id: 'admin',
          role: 'admin',
          email: adminUsername,
          name: 'Administrator'
        };
        req.userId = 'admin';
        req.isAdmin = true;
        
        console.log('Admin user set:', req.user);
        return next();
      }
    } catch (base64Error) {
      console.log('Not a base64 admin token, trying JWT...');
    }
    
    // SECOND: Try JWT (regular users)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('JWT verified:', decoded);
      
      req.user = decoded;
      req.userId = decoded.id || decoded.userId || decoded._id;
      req.isAdmin = false;
      
      console.log('Regular user set:', { userId: req.userId, isAdmin: req.isAdmin });
      return next();
    } catch (jwtError) {
      console.log('JWT verification failed:', jwtError.message);
      
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

module.exports = auth;