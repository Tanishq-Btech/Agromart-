const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/admin/farmers - all farmer profiles
router.get('/farmers', protect, adminOnly, async (req, res) => {
  try {
    const profiles = await FarmerProfile.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/verify-farmer
router.put('/verify-farmer', protect, adminOnly, async (req, res) => {
  try {
    const { farmerId, status, rejectionReason } = req.body;
    const profile = await FarmerProfile.findById(farmerId);
    if (!profile) return res.status(404).json({ message: 'Farmer profile not found' });
    profile.verificationStatus = status;
    if (rejectionReason) profile.rejectionReason = rejectionReason;
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/analytics
router.get('/analytics', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingFarmers = await FarmerProfile.countDocuments({ verificationStatus: 'pending' });
    const orders = await Order.find({ status: 'delivered' });
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    res.json({ totalUsers, totalFarmers, totalCustomers, totalProducts, totalOrders, pendingFarmers, totalRevenue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/orders
router.get('/orders', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
