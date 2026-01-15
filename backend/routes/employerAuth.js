const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');

// Secret key for JWT (Ensure this is in your .env file)
const JWT_SECRET = process.env.JWT_SECRET || "Candidate_Secret_Key_2024";

// -----------------------------------------------------------------------------------------
// ROUTE 1: Register a Job Seeker using: POST "/api/auth/candidate/register"
// -----------------------------------------------------------------------------------------
router.post('/register', [
    // Validations based on your requested fields
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters long').isLength({ min: 5 }),
    body('firstName', 'First name is required').notEmpty(),
    body('lastName', 'Last name is required').notEmpty(),
    body('contactNumber', 'Contact number is required').notEmpty(),
    body('jobPreference', 'Please select a job preference').notEmpty(),

    // Validation: Check if Emails Match
    body('retypeEmail').custom((value, { req }) => {
        if (value !== req.body.email) {
            throw new Error('Email confirmation does not match email');
        }
        return true;
    }),

    // Validation: Check if Passwords Match
    body('retypePassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    })
], async (req, res) => {
    let success = false;
    
    // If there are validation errors, return 400
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        // Check if the candidate email already exists
        let candidate = await Candidate.findOne({ email: req.body.email });
        if (candidate) {
            return res.status(400).json({ success, error: "A user with this email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create the new Candidate record
        candidate = await Candidate.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            contactNumber: req.body.contactNumber,
            jobPreference: req.body.jobPreference,
            role: 'candidate'
        });

        // Generate JWT token
        const data = {
            user: {
                id: candidate.id,
                role: 'candidate'
            }
        };

        const token = jwt.sign(data, JWT_SECRET);
        success = true;
        
        res.json({ success, token, role: 'candidate' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});

// -----------------------------------------------------------------------------------------
// ROUTE 2: Login for Job Seeker using: POST "/api/auth/candidate/login"
// -----------------------------------------------------------------------------------------
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be empty').exists()
], async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        // Find candidate in the Candidate collection
        let candidate = await Candidate.findOne({ email });
        if (!candidate) {
            return res.status(400).json({ success, error: "Invalid login credentials" });
        }

        // Check if password is correct
        const passwordCompare = await bcrypt.compare(password, candidate.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Invalid login credentials" });
        }

        // Generate Token
        const data = {
            user: {
                id: candidate.id,
                role: 'candidate'
            }
        };

        const token = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, token, role: 'candidate' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});

// -----------------------------------------------------------------------------------------
// ROUTE 3: Get Logged-in Candidate Details: POST "/api/auth/candidate/getuser" (Login Required)
// -----------------------------------------------------------------------------------------
router.post('/getuser', fetchUser, async (req, res) => {
    try {
        // req.user.id comes from the fetchUser middleware
        const candidate = await Candidate.findById(req.user.id).select("-password");
        res.json({ success: true, user: candidate });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;