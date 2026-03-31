const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FarmerProfile = require('../models/FarmerProfile');
const { protect, farmerOnly } = require('../middleware/auth');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// POST /api/farmer/register
router.post('/register', protect, upload.fields([
  { name: 'govIdProof', maxCount: 1 },
  { name: 'landProof', maxCount: 1 }
]), async (req, res) => {
  try {
    const existing = await FarmerProfile.findOne({ user: req.user._id });
    if (existing) return res.status(400).json({ message: 'Profile already exists' });

    const { farmName, farmLocation, cropTypes, farmSize, bankName, accountNumber, ifscCode } = req.body;

    const profile = await FarmerProfile.create({
      user: req.user._id,
      farmName, farmLocation, cropTypes, farmSize,
      bankName, accountNumber, ifscCode,
      govIdProof: req.files?.govIdProof?.[0]?.filename,
      landProof: req.files?.landProof?.[0]?.filename
    });
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/farmer/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const profile = await FarmerProfile.findOne({ user: req.user._id });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/farmer/dashboard
router.get('/dashboard', protect, farmerOnly, async (req, res) => {
  try {
    const Product = require('../models/Product');
    const Order = require('../models/Order');

    const products = await Product.countDocuments({ farmer: req.user._id });
    const orders = await Order.find({ 'items.farmer': req.user._id });
    const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length;
    const totalEarnings = orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => {
        const myItems = o.items.filter(i => i.farmer?.toString() === req.user._id.toString());
        return sum + myItems.reduce((s, i) => s + i.price * i.quantity, 0);
      }, 0);

    res.json({ products, activeOrders, totalEarnings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
