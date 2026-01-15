const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure this matches your filename (usually singular User)
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');

// Secret key for JWT (Make sure this is defined in your .env file)
const JWT_SECRET = process.env.JWT_SECRET || "DefaultSecretKeyForJobPortal";

// -----------------------------------------------------------------------------------------
// ROUTE 1: Create a User using: POST "api/auth/createUser". No login required
// -----------------------------------------------------------------------------------------
router.post('/createUser', [
    body('name', 'Enter a valid name (min 3 characters)').isLength({ min: 3 }),
    body('email', 'Enter a valid email address').isEmail(),
    body('password', 'Password must be at least 5 characters long').isLength({ min: 5 }),
    body('role', 'Role must be either candidate or employer').isIn(['candidate', 'employer']) // NEW: Validation for Role
], async (req, res) => {
    let success = false;
    
    // If there are validation errors, return Bad Request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        // Check if the user's email already exists
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: 'Sorry, a user with this email already exists!' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user with the specified role
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role // NEW: Save the role (employer or candidate)
        });

        // Prepare JWT Data (Include role for authorization later)
        const data = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        const token = jwt.sign(data, JWT_SECRET);
        success = true;
        
        // Return success, token and user role
        res.json({ success, token, role: user.role });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// -----------------------------------------------------------------------------------------
// ROUTE 2: Authenticate a User using: POST "api/auth/login". No login required
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
        // Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }

        // Check if password matches
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }

        // Generate JWT (Include role in token)
        const data = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        const token = jwt.sign(data, JWT_SECRET);
        success = true;
        
        // Return token and role so the frontend can redirect accordingly
        res.json({ success, token, role: user.role });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// -----------------------------------------------------------------------------------------
// ROUTE 3: Get logged in User Details: POST "api/auth/getUser". Login required
// -----------------------------------------------------------------------------------------
router.post('/getUser', fetchUser, async (req, res) => {
    try {
        // req.user.id is coming from fetchUser middleware
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json({ success: true, user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

module.exports = router;