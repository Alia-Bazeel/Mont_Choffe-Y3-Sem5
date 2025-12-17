const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

/* USER LOGIN (PUBLIC) */

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* ADMIN-ONLY MIDDLEWARE */

const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

/* CREATE USER (ADMIN) */

router.post('/', auth, adminOnly, async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const newUser = new User({
            name,
            email,
            password,
            role: role || 'user'
        });

        await newUser.save();

        const { password: _, ...userData } = newUser.toObject();
        res.status(201).json(userData);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* GET ALL USERS (ADMIN) */

router.get('/', auth, adminOnly, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* GET SINGLE USER (ADMIN) */

router.get('/:id', auth, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* UPDATE USER (ADMIN) */

router.put('/:id', auth, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.role) user.role = req.body.role;
        if (req.body.password) user.password = req.body.password;

        await user.save();

        const { password: _, ...userData } = user.toObject();
        res.json(userData);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* DELETE USER (ADMIN) */

router.delete('/:id', auth, adminOnly, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* GOOGLE AUTH */
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google-auth', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Google token is required' });
    }

    try {
        // Verify the token with Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name;

        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create a new user with random password (not used)
            user = new User({
                name,
                email,
                password: Math.random().toString(36).slice(-10), // random
                role: 'user'
            });
            await user.save();
        }

        // Create JWT for your backend
        const jwt = require('jsonwebtoken');
        const tokenJWT = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({
            jwt: tokenJWT,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Google Auth error:', error);
        res.status(500).json({ error: 'Google authentication failed' });
    }
});

/* PUBLIC SIGNUP (FRONTEND USERS) */
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create new user with role 'user'
        const newUser = new User({ name, email, password, role: 'user' });
        await newUser.save();

        const { password: _, ...userData } = newUser.toObject();
        res.status(201).json({ message: 'Signup successful', user: userData });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
