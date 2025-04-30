const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  author: String,
  date: { type: Date, default: Date.now },
  media: {
    type: String, // This will store the file path (for image or video)
    required: false, // Optional field for now
  },
  likes: { type: Number, default: 0 }, // Adding a likes field
  comments: [{ 
    user: { type: String, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }] // Array of comments
});

module.exports = mongoose.model("Post", postSchema);
