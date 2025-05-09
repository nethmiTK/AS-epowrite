const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  email: { type: String, required: true },  // Target user
  author: { type: String, required: true },  // Author of the post
  reason: { type: String, required: true },  // Reason for notification (e.g., post deleted)
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
