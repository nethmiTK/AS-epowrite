const mongoose = require('mongoose');  // Add this line at the top of your file

const postSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    author: String,
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
        reportedBy: String,  // user ID or username
        reporterName: String, // new field
        reason: String,       // new field
        reportedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);
