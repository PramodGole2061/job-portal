import express from 'express';

import verifyUser from '../middleware/verifyUser.js';
import {body, validationResult} from 'express-validator';
import {fetchalljobs, addjob, updatejob, deletejob} from '../controllers/jobController.js';

const router = express.Router();

// ROUTE 1: Fetch All Jobs
router.get('/fetchalljobs', fetchalljobs);

// ROUTE 2: Add a new Job (Employer Only)
router.post('/addjob', verifyUser, [
    body('title', 'Title is too short').isLength({ min: 3 }),
    body('description', 'Description is too short').isLength({ min: 10 }),
    body('location', 'Location is required').notEmpty()
], addjob);

// ROUTE 3: Update an existing Job (Login Required)
router.put('/updatejob/:postId/:employerId', verifyUser, updatejob);

// ROUTE 4: Delete a Job (Login Required)
router.delete('/deletejob/:postId/:employerId', verifyUser, deletejob);


export default router;