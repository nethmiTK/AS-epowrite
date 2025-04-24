const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');        // Your login/register routes
const userRoutes = require('./routes/userRoutes');  // Your profile routes
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// MongoDB Connection
mongoose
  .connect('mongodb://localhost:27017/user-mern-dashboard', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((error) => console.error('❌ MongoDB connection failed:', error));

// Server Start
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});



// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// const authRoutes = require('./routes/auth');        // Your login/register routes
// const userRoutes = require('./routes/userRoutes');  // Your profile routes
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Serve uploaded images
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);

// // MongoDB Connection
// mongoose
//   .connect('mongodb://localhost:27017/user-mern-dashboard', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch((error) => console.error('❌ MongoDB connection failed:', error));

// // Server Start
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
