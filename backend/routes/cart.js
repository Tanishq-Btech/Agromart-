const express = require('express');
const router = express.Router();
// Cart is managed on frontend (localStorage), this is just a placeholder
router.get('/', (req, res) => res.json({ message: 'Cart managed on frontend' }));
module.exports = router;
