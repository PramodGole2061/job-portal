import express from 'express';
import {body, validationResult} from 'express-validator';

import verifyUser from '../middleware/verifyUser.js';
import {register, login, getcandidates, updateCandidate, deleteCandidate} from '../controllers/candidateAuthController.js';

const router = express.Router();

// ROUTE 1: Register a Job Seeker
router.post('/register', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters long').isLength({ min: 5 }),
    body('firstName', 'First name is required').notEmpty(),
    body('lastName', 'Last name is required').notEmpty(),
    body('contactNumber', 'Contact number is required').notEmpty(),
    body('jobPreference', 'Please select a job preference').notEmpty(),

    body('retypePassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    })
], register);

// ROUTE 2: Login for Job Seeker
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be empty').exists()
], login);

// ROUTE 3: Get Logged-in Candidate Details (Login Required)
router.post('/getcandidates', verifyUser, getcandidates);


// ROUTE 4: Update Candidate Profile Login Required
router.put('/update/:userId', verifyUser, updateCandidate);

// ROUTE 5: Delete Candidate Account (Login Required)
router.delete('/delete/:userId', verifyUser, deleteCandidate);

export default router;