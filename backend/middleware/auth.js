const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'agromart_secret');
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  }
  if (!token) return res.status(401).json({ message: 'No token' });
};

const farmerOnly = (req, res, next) => {
  if (req.user.role !== 'farmer') return res.status(403).json({ message: 'Farmer access only' });
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access only' });
  next();
};

module.exports = { protect, farmerOnly, adminOnly };
