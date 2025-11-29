const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./Routes/Auth');
const protectedRoutes = require('./Routes/protectedRoutes');
const superAdminRoutes = require('./Routes/SuperAdminRoutes');
const path = require('path');
const ProductRoutes = require('./Routes/Products');
const bookingRoutes = require('./Routes/Booking');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' })); // Increase the limit for JSON payloads
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Increase the limit for URL-encoded payloads
app.use(cors({ origin: 'http://localhost:3000' }));

// Serve static files from the 'images' directory
app.use('/uploads', express.static(path.join(__dirname, 'images')));

// Connect to MongoDB
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI, {
  serverSelectionTimeoutMS: 30000, // Optional: Increase the timeout value
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api', ProductRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/test', (req, res) => {
    res.json({ message: 'This is a test API endpoint!' });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
