const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken.js');

// Protected route
const authorizeRole = (allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied. Insufficient permissions' });
  }
  next();
};

module.exports = authorizeRole;
