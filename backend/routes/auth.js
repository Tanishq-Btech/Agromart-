const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'agromart_secret', { expiresIn: '30d' });

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({ name, email, phone, password, role: role || 'customer' });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    let farmerStatus = null;
    if (user.role === 'farmer') {
      const profile = await FarmerProfile.findOne({ user: user._id });
      farmerStatus = profile ? profile.verificationStatus : null;
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      farmerStatus,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
