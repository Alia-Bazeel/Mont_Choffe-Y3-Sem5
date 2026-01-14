require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoute = require('./routes/authRoute');
const productRoute = require('./routes/productRoute');
const usersRoute = require('./routes/usersRoute');
const ordersRoute = require('./routes/ordersRoute');

app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);
app.use('/api/users', usersRoute);
app.use('/api/orders', ordersRoute);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend running' });
});

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
