const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Save files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // Use timestamp to avoid conflicts
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // Max file size: 5MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);  // Accept the file
    }
    cb(new Error('Only images are allowed'));  // Reject if not an image
  }
});

module.exports = upload;
