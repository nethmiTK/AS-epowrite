// User update controller (e.g., in controllers/userController.js)

const User = require('../models/User');
const Post = require('../models/Post'); // import the Post model

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id; // assuming this is populated by auth middleware
    const { fullName, username } = req.body;

    // Handle file upload if needed (e.g., req.file for profile picture)

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, username },
      { new: true }
    );

    // After updating the user's name, update their posts' authorName
    await Post.updateMany(
      { author: userId },
      { $set: { authorName: fullName } }
    );

    res.status(200).json({
      message: 'Profile updated and posts updated with new name.',
      user: updatedUser,
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};
