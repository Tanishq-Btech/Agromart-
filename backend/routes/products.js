const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const FarmerProfile = require('../models/FarmerProfile');
const { protect, farmerOnly } = require('../middleware/auth');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// GET /api/products - public
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = { isAvailable: true, stock: { $gt: 0 } };
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await Product.find(filter)
      .populate('farmer', 'name email phone')
      .populate('farmerProfile', 'farmName farmLocation')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/my - farmer's own products
router.get('/my', protect, farmerOnly, async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'name email phone')
      .populate('farmerProfile', 'farmName farmLocation cropTypes');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products - farmer only, must be approved
router.post('/', protect, farmerOnly, upload.single('image'), async (req, res) => {
  try {
    const profile = await FarmerProfile.findOne({ user: req.user._id });
    if (!profile || profile.verificationStatus !== 'approved') {
      return res.status(403).json({ message: 'Only approved farmers can add products' });
    }

    const { name, description, category, price, unit, stock, imageUrl } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : imageUrl;

    const product = await Product.create({
      farmer: req.user._id,
      farmerProfile: profile._id,
      name, description, category,
      price: Number(price),
      unit: unit || 'kg',
      stock: Number(stock),
      image
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/products/:id
router.put('/:id', protect, farmerOnly, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, farmer: req.user._id });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, description, category, price, unit, stock, isAvailable, imageUrl } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (price) product.price = Number(price);
    if (unit) product.unit = unit;
    if (stock !== undefined) product.stock = Number(stock);
    if (isAvailable !== undefined) product.isAvailable = isAvailable === 'true';
    if (req.file) product.image = `/uploads/${req.file.filename}`;
    else if (imageUrl) product.image = imageUrl;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', protect, farmerOnly, async (req, res) => {
  try {
    await Product.findOneAndDelete({ _id: req.params.id, farmer: req.user._id });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
