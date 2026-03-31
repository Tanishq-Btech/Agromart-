const express = require('express');
const router = express.Router();
const { simulateChatResponse, simulateDocumentVerification } = require('../utils/aiSimulator');

// Chatbot mock response endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Simulate network delay to make it feel real
    const delay = Math.floor(Math.random() * (1500 - 500) + 500); // 500ms - 1500ms
    setTimeout(() => {
      const response = simulateChatResponse(message);
      res.json({ response });
    }, delay);

  } catch (err) {
    res.status(500).json({ error: 'Failed to process AI chat message.' });
  }
});

// Document Verification mock endpoint
router.post('/verify-doc', async (req, res) => {
  try {
    // In a real app we would expect files in req.files
    // We just simulate the check delay here!

    const delay = Math.floor(Math.random() * (3000 - 1500) + 1500); // 1.5s - 3s
    setTimeout(() => {
      const result = simulateDocumentVerification();
      res.json(result);
    }, delay);

  } catch (err) {
    res.status(500).json({ error: 'Failed to verify document.' });
  }
});

module.exports = router;
