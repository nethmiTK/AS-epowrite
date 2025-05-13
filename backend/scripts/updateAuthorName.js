const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

// Connect to the database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateAuthorName = async (email, newFullName) => {
  try {
    // Update the author's name in the User model
    const user = await User.findOneAndUpdate(
      { email },
      { fullName: newFullName },
      { new: true }
    );

    if (!user) {
      console.log('No user found with the provided email.');
      return;
    }

    // Update the author's name in all posts with the same email
    const result = await Post.updateMany(
      { author: email },
      { authorName: newFullName }
    );

    console.log(`Updated ${result.nModified} posts with the new author name.`);
  } catch (error) {
    console.error('Error updating author name:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Example usage
const email = 'example@example.com'; // Replace with the author's email
const newFullName = 'New Author Name'; // Replace with the new full name
updateAuthorName(email, newFullName);
