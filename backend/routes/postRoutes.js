const express = require('express');
const Post = require('../models/Post');  // Your Post model
const upload = require('../middleware/upload');  // Multer upload config
const router = express.Router();

// Fetch all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
});

// Create a new post with media upload
router.post('/', upload.single('media'), async (req, res) => {
  const { title, description, author } = req.body;
  let media = null;

  // Check if a file was uploaded and store the file path
  if (req.file) {
    media = req.file.path; // Save the file path (image/video)
  }

  try {
    const newPost = new Post({ title, description, author, media });
    await newPost.save();
    res.status(201).json(newPost); // Respond with the newly created post
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

module.exports = router;
