const express = require('express');
const Post = require('../models/Post');
const upload = require('../middleware/upload');
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

// Create a new post
router.post('/', upload.single('media'), async (req, res) => {
  const { title, description, author } = req.body;
  let media = null;
  if (req.file) {
    media = req.file.path;
  }

  try {
    const newPost = new Post({ title, description, author, media });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

// Toggle like
router.post('/:postId/like', async (req, res) => {
  try {
    const userId = req.body.userId;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling like', error: error.message });
  }
});

// Add comment
router.post('/:postId/comment', async (req, res) => {
  const { comment, user } = req.body;
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user, comment });
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
});

// Full update
router.put('/:postId', upload.single('media'), async (req, res) => {
  const { title, description, author } = req.body;
  let media = null;
  if (req.file) {
    media = req.file.path;
  }

  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { title, description, author, media },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
});

// Partial update
router.patch('/:postId', upload.single('media'), async (req, res) => {
  const { title, description, author } = req.body;
  let media = null;
  if (req.file) {
    media = req.file.path;
  }

  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (title) post.title = title;
    if (description) post.description = description;
    if (author) post.author = author;
    if (media) post.media = media;

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
});

// Delete a post
router.delete('/:postId', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.postId);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
});

module.exports = router;
