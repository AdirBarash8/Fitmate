const express = require('express');
const cors = require('cors');
const matchRoutes = require('./routes/matchRoutes');
const locationRoutes = require('./routes/locationRoutes');
const userRoutes = require('./routes/userRoutes');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const meetingRoutes = require('./routes/meetingRoutes');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', matchRoutes);
app.use('/api', locationRoutes);
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', meetingRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 Node.js API running on port ${PORT}`);
});
