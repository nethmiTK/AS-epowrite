const express = require('express');
const Post = require('../models/Post');  // Your Post model
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Define storage configuration for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique file names
  }
});

// Initialize multer with the storage configuration and file filter
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true); // Accept the file
    } else {
      cb(new Error('Only images and videos are allowed')); // Reject the file if not of valid type
    }
  }
});

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
    media = req.file.path; // Save the file path (image/video) in the 'media' field
  }

  try {
    const newPost = new Post({ title, description, author, media });
    await newPost.save();
    res.status(201).json(newPost); // Respond with the newly created post
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

// Edit a post
router.put('/:id', async (req, res) => {
  const { title, description, author } = req.body;
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, description, author },
      { new: true }
    );
    if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
});

// Get a specific post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

module.exports = router;
