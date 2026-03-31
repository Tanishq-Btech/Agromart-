const express = require('express');
const router = express.Router();
const Query = require('../models/Query');
const { protect, adminOnly } = require('../middleware/auth');

// @desc    Submit a new query
// @route   POST /api/queries
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { subject, message } = req.body;
    
    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    const query = new Query({
      user: req.user.id,
      subject,
      message,
    });

    const savedQuery = await query.save();
    res.status(201).json(savedQuery);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get user's queries
// @route   GET /api/queries/my-queries
// @access  Private
router.get('/my-queries', protect, async (req, res) => {
  try {
    const queries = await Query.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get all queries (Admin)
// @route   GET /api/queries
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const queries = await Query.find().populate('user', 'name email role').sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Reply to a query (Admin)
// @route   PUT /api/queries/:id/reply
// @access  Private/Admin
router.put('/:id/reply', protect, adminOnly, async (req, res) => {
  try {
    const { reply } = req.body;
    
    if (!reply) {
      return res.status(400).json({ message: 'Reply message is required' });
    }

    const query = await Query.findById(req.params.id);
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    query.reply = reply;
    query.status = 'resolved';
    query.updatedAt = Date.now();

    const updatedQuery = await query.save();
    res.json(updatedQuery);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
