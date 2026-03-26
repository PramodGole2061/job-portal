import express from 'express';
import {body, validationResult} from 'express-validator';

import verifyUser from '../middleware/verifyUser.js';
import {register, login, getcandidates, updateCandidate, changePassword, deleteCandidate, toggleSaveJob, getSavedJobs} from '../controllers/candidateAuthController.js';

const router = express.Router();

// ROUTE 1: register a Job Seeker
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

// ROUTE 2: login for Job Seeker
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be empty').exists()
], login);

// ROUTE 3: get logged-in candidate details 
router.post('/getcandidates', verifyUser, getcandidates);


// ROUTE 4: update candidate profile 
router.put('/update/:userId', verifyUser, updateCandidate);

// ROUTE 5: delete candidate account 
router.delete('/delete/:userId', verifyUser, deleteCandidate);

// ROUTE 6: toggle save/unsave job 
router.post('/save-job/:jobId', verifyUser, toggleSaveJob);

// ROUTE 7: get all saved jobs for candidate 
router.get('/saved-jobs', verifyUser, getSavedJobs);

// ROUTE 8: Change Password
router.put('/change-password', verifyUser,[
    body('oldPassword', 'Old password is required').exists(),
    body('newPassword', 'New password must be at least 5 characters long').isLength({ min: 5 })
], changePassword);

export default router;