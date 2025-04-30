const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  author: String,
  date: { type: Date, default: Date.now },
  media: {
    type: String,
    required: false, // Optional field for now
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],  // Array of user IDs who liked the post
  comments: [
    {
      user: { type: String, required: true },  // User who commented
      comment: { type: String, required: true },  // Comment text
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("Post", postSchema);
