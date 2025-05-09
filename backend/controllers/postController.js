const Notification = require('../models/Notification');
const Post = require('../models/Post');

// Function to delete a post
const handleDeletePost = async (req, res) => {
  const postId = req.params.id;

  try {
    // Delete the post
    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });

    // Create a notification for the post deletion
    const newNotification = new Notification({
      email: 'admin@example.com',  // Replace with the target user email
      author: post.author,         // Assuming 'author' is a field in your post schema
      reason: 'Post deleted',      // Notification reason
    });

    // Save the notification to the database
    await newNotification.save();

    res.status(200).json({ message: 'Post deleted successfully' });

  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ message: 'Error deleting post.' });
  }
};

module.exports = { handleDeletePost };
