const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token from Authorization header
const verifyToken = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'helpdesk_secret_jwt_token_key_assignment6_2026'
      );

      // Fetch user without password
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found. Authorization denied.' });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No authorization token provided.' });
  }
};

// Optional auth: Attaches user if valid token exists, otherwise proceeds as guest
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'helpdesk_secret_jwt_token_key_assignment6_2026'
      );
      const user = await User.findById(decoded.id).select('-password');
      if (user) req.user = user;
    } catch {
      // Ignore token errors in optionalAuth
    }
  }
  next();
};

// Check specific user role (e.g. 'admin')
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        message: `Access denied. Only ${role} users can perform this action.`,
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  optionalAuth,
  requireRole,
};
