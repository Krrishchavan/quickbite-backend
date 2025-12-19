const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(express.json());
// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://quickbite-frontend-lake.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('QuickBite Backend Running');
});

// Import Routes
const authRoutes = require('../routes/authRoutes');
const menuRoutes = require('../routes/menuRoutes');
const orderRoutes = require('../routes/orderRoutes');
const restaurantRoutes = require('../routes/restaurantRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/restaurants', restaurantRoutes);

// Export for Vercel
module.exports = app;

// Start Server (only if not running in Vercel environment)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
