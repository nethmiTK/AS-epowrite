const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get notifications by email
router.get('/:email', async (req, res) => {
  try {
    const notes = await Notification.find({ email: req.params.email }).sort({ date: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
