const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/* USER SCHEMA */

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    // Role helps us protect admin routes
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

/* PASSWORD HASHING */

// Hash password before saving user
UserSchema.pre('save', async function (next) {
    // Only hash if password is modified
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/* PASSWORD COMPARISON METHOD */

// Compare entered password with hashed password
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
