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
});

module.exports = mongoose.model("Post", postSchema);
