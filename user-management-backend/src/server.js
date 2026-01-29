require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database.js');
const userRoutes = require('./routes/userRoutes.js');
const errorHandler = require('./middlewares/errorHandler.js');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'User Management API is running'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});