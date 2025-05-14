const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth'); // Your login/register routes
const userRoutes = require('./routes/userRoutes'); // Your profile routes
const postRoutes = require('./routes/postRoutes'); // Your post routes
const notificationRoutes = require('./routes/notifications');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/notifications', notificationRoutes);

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);  
app.use('/api/posts', postRoutes);  

// MongoDB Connection
mongoose
  .connect('mongodb://localhost:27017/AS-epowrite', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((error) => console.error('❌ MongoDB connection failed:', error));

// Server Start
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
