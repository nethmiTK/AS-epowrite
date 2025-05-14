const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { updateUser } = require('../controllers/userController');
const Post = require('../models/Post');

// GET current user profile
router.get('/profile', authenticate, (req, res) => {
  res.json(req.user);
});
router.patch('/:postId/softdelete', async (req, res) => {
  try {
    // Find the post by ID
    const post = await Post.findById(req.params.postId);
    if (!post) {
      // If the post does not exist, return 404
      return res.status(404).json({ message: 'Post not found' });
    }

    // Soft delete the post by setting isDeleted to true
    post.isDeleted = true;

    // Save the post to the database
    await post.save();

    // Send a success response with the deleted post
    res.status(200).json({ message: 'Post soft deleted successfully', post });
  } catch (error) {
    // Handle errors (e.g., server errors)
    res.status(500).json({ message: 'Error soft deleting post', error: error.message });
  }
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
