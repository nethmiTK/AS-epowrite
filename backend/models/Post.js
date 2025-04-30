const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  author: String,
  media: String,
  likes: {
    type: [String], // Array of userIds
    default: [],
  },
  comments: [
    {
      user: String,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model('Post', postSchema);
