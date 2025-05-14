const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    author: String, // Save userId here
    authorName: String, // Save fullName here
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
      default: false, // Soft delete
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);
