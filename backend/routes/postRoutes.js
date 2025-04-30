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

// Like or Unlike a Post (toggle)
router.post('/:postId/like', async (req, res) => {
  try {
    const userId = req.body.userId;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const index = post.likes.indexOf(userId);
    if (index === -1) {
      // Not liked yet, so like
      post.likes.push(userId);
    } else {
      // Already liked, so unlike
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json(post); // Return updated post with new likes array
  } catch (error) {
    res.status(500).json({ message: 'Error toggling like', error: error.message });
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

// Update a post (Replace the entire post with new data)
router.put('/:postId', upload.single('media'), async (req, res) => {
  const { title, description, author } = req.body;
  let media = null;

  if (req.file) {
    media = req.file.path;  // Save the file path (image/video)
  }

  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { title, description, author, media },
      { new: true }  // This ensures the updated post is returned
    );

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(post); // Respond with the updated post
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
});

// Update a post (Partial update, updating only provided fields)
router.patch('/:postId', upload.single('media'), async (req, res) => {
  const { title, description, author } = req.body;
  let media = null;

  if (req.file) {
    media = req.file.path;  // Save the file path (image/video)
  }

  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Update only the fields that were provided
    if (title) post.title = title;
    if (description) post.description = description;
    if (author) post.author = author;
    if (media) post.media = media;

    await post.save();
    res.json(post);  // Respond with the updated post
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
});

module.exports = router;
