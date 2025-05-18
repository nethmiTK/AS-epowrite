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
router.patch('/:postId/softdelete', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.isDeleted = true; // Set isDeleted to true
    await post.save();
    res.status(200).json({ message: 'Post soft deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error soft deleting post', error: error.message });
  }
});

router.post('/', upload.single('media'), async (req, res) => {
  const { title, description, author, authorName } = req.body;
  let media = null;
  if (req.file) {
    media = req.file.path;
  }

  try {
    const newPost = new Post({ title, description, author, authorName, media });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});
// Delete post and send notification
router.delete('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Create notification
    await Notification.create({
      userEmail: post.author,
      message: `Your post titled "${post.title}" was deleted by an admin.`,
      date: new Date(),
    });

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted and user notified' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get notifications for user
router.get('/api/notifications', async (req, res) => {
  const userEmail = req.query.email; // from frontend query
  if (!userEmail) return res.status(400).json({ message: 'Email required' });

  const notifications = await Notification.find({ userEmail }).sort({ date: -1 });
  res.status(200).json(notifications);
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
  let updateFields = { title, description, author };

  if (req.file) {
    updateFields.media = req.file.path;
  }

  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      updateFields,
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
// Soft delete post by updating the 'isDeleted' field
router.patch('/:postId/softdelete', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.isDeleted = true; // Set isDeleted to true
    await post.save();
    res.status(200).json({ message: 'Post soft deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error soft deleting post', error: error.message });
  }
});

// Restore a soft-deleted post
router.patch('/:postId/restore', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.isDeleted = false; // Set isDeleted to false
    await post.save();
    res.status(200).json({ message: 'Post restored successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error restoring post', error: error.message });
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
router.post('/:postId/report', async (req, res) => {
  const { postId } = req.params;
  const { reportedBy, reporterName, reason } = req.body; // get all required fields

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $set: { reported: true },
        $push: {
          reports: {
            reportedBy,
            reporterName,
            reason,
            reportedAt: new Date(), // explicitly set the timestamp
          },
        },
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ message: 'Post reported successfully', post: updatedPost });
  } catch (err) {
    res.status(500).json({ message: 'Error reporting the post', error: err });
  }
});


// Get all reported posts
router.get('/reported', async (req, res) => {
  try {
    const reportedPosts = await Post.find({ reported: true }).sort({ updatedAt: -1 });
    res.json(reportedPosts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reported posts', error: err });
  }
});

// Get all deleted posts
router.get('/deleted', async (req, res) => {
  try {
    const deletedPosts = await Post.find({ isDeleted: true });
    res.json(deletedPosts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching deleted posts', error: err });
  }
});


module.exports = router;
