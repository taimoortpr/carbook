const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to authenticate user
const authenticate = async (req, res, next) => {
  console.log('Authenticate Middleware');
  
  // Extract token from Authorization header
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user data to request object
    req.user = { adminId: decoded.id, role: decoded.role };
    console.log('Authenticated User:', req.user);
    
    next();
  } catch (err) {
    console.error('Token Verification Error:', err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

// Middleware to check if the user is a superadmin
const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Access denied. Superadmins only.' });
  }
  next();
};

module.exports = { authenticate, isAdmin, isSuperAdmin };
