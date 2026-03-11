import express from 'express';
import {body, validationResult} from 'express-validator';

import verifyUser from '../middleware/verifyUser.js';
import {register, login, getuser, updateUser, deleteUser} from '../controllers/employerAuthController.js';

const router = express.Router();

// ROUTE 1: Register a Company/Employer
router.post('/register', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    body('companyName', 'Company name is required').notEmpty(),
    body('primaryPhone', 'Primary phone number is required').notEmpty(),
    body('industry', 'Please choose a company industry').notEmpty(),
    body('city', 'City is required').notEmpty(),
    body('location', 'Specific location is required').notEmpty(),
    body('contactPersonName', 'Contact person name is required').notEmpty(),
    body('contactPersonMobile', 'Contact person mobile is required').notEmpty(),
    body('contactPersonEmail', 'Enter a valid contact person email').isEmail(),


    body('retypePassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    })
    
], register);

// ROUTE 2: Login for Company/Employer
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be empty').exists()
], login);

// ROUTE 3: Get Logged-in Company Details (Login Required)
router.post('/getuser', verifyUser, getuser);

// ROUTE 4: Update All Fields (Login Required)
router.put('/update/:employerId', verifyUser, updateUser);

// ROUTE 5: Delete Account (Login Required)
router.delete('/delete/:employerId', verifyUser, deleteUser);

export default router;