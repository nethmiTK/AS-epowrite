const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Route Imports
const authRoutes = require('./routes/auth');         // Authentication (login/register)
const userRoutes = require('./routes/userRoutes');   // User profile
const postRoutes = require('./routes/posts');        // Blog posts

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Static files (optional if you're serving uploads)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// MongoDB Connection
mongoose
  .connect('mongodb://localhost:27017/epowrite', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ MongoDB connected to epowrite'))
  .catch((error) => console.error('❌ MongoDB connection failed:', error));

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
