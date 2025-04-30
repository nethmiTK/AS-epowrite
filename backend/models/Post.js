const mongoose = require('mongoose');  // Add this line

const postSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Post', postSchema);
