const express = require('express');
const Post = require('../models/Post');
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

  if (req.file) {
    media = req.file.path;  // Save the file path (image/video)
  }

  try {
    const newPost = new Post({ title, description, author, media });
    await newPost.save();
    res.status(201).json(newPost);  // Respond with the newly created post
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

// Like a post
router.post('/:postId/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.likes += 1;  // Increment like count
    await post.save();
    res.json(post);  // Respond with the updated post
  } catch (error) {
    res.status(500).json({ message: 'Error liking post', error: error.message });
  }
});

// Add a comment to a post
router.post('/:postId/comment', async (req, res) => {
  const { comment, user } = req.body;  // Assuming you are passing user and comment in the body
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Add the new comment
    post.comments.push({ user, comment });
    await post.save();
    res.json(post);  // Respond with the updated post
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
});

module.exports = router;
