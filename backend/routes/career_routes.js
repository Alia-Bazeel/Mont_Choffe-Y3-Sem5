const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { check, validationResult } = require('express-validator');
const fs = require('fs');

// Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/resumes/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `resume-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
        }
    }
});

// @route   POST /api/career/apply
// @desc    Submit career application
// @access  Public
router.post('/apply', upload.single('resume'), [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('message', 'Cover message is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const { name, email, phone, message } = req.body;
        const resume = req.file;

        if (!resume) {
            return res.status(400).json({
                success: false,
                message: 'Resume file is required'
            });
        }

        res.json({
            success: true,
            message: 'Application submitted successfully!',
            application: {
                name,
                email,
                phone,
                resume: resume.filename
            }
        });
    } catch (error) {
        console.error('Application error:', error);
        
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Failed to delete file:', err);
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to submit application'
        });
    }
});

module.exports = router;