
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); // Load environment variables

const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

/* MIDDLEWARE */

// Parse incoming JSON data
app.use(express.json());

// Serve admin frontend files
app.use('/admin', express.static(path.join(__dirname, 'admin')));

/* DATABASE CONNECTION */

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected (Mont Choffe)'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

/* ROUTES */

// User-related API routes
app.use('/api/users', userRoutes);

// Health check (optional but professional)
app.get('/', (req, res) => {
    res.send('Mont Choffe Backend is running ☕🍫');
});

/* SERVER START */

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
