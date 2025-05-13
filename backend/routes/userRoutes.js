const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { updateUser } = require('../controllers/userController');

// GET current user profile
router.get('/profile', authenticate, (req, res) => {
  res.json(req.user);
});

// UPDATE current user profile with file upload
router.put('/update', authenticate, upload.single('pp'), async (req, res) => {
  try {
    const { fullName, username, email } = req.body;

    if (fullName) req.user.fullName = fullName;
    if (username) req.user.username = username;
    if (email) req.user.email = email;
    if (req.file) req.user.pp = `/uploads/${req.file.filename}`;  // save path in DB

    await req.user.save();

    res.json({
      message: 'Profile updated successfully',
      user: req.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Profile update failed' });
  }
});

module.exports = router;
