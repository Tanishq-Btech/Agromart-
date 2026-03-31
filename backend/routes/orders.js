const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, farmerOnly } = require('../middleware/auth');

// POST /api/orders - place order
router.post('/', protect, async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product not found` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
        farmer: product.farmer
      });
      totalAmount += product.price * item.quantity;
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      estimatedDelivery: '3-5 business days'
    });

    const populated = await Order.findById(order._id).populate('items.product', 'name image');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders - get orders (customer: own, farmer: received)
router.get('/', protect, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'customer') {
      orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    } else if (req.user.role === 'farmer') {
      orders = await Order.find({ 'items.farmer': req.user._id })
        .populate('customer', 'name email phone')
        .sort({ createdAt: -1 });
    } else {
      orders = await Order.find().populate('customer', 'name email').sort({ createdAt: -1 });
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name image');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
