// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    author: String,
    authorName: String,
    media: String,
    likes: {
      type: [String],
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
    reported: {
      type: Boolean,
      default: false,
    },
    reports: [
      {
        reportedBy: String,
        reporterName: String,
        reason: String,
        reportedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false, // added for soft delete
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);
