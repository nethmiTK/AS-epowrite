const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userEmail: String,
  message: String,
  date: Date,
  read: { type: Boolean, default: false },
});

module.exports = mongoose.model('Notification', notificationSchema);
