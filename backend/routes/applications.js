import express from 'express';
import verifyUser from '../middleware/verifyUser.js';
import upload from '../middleware/upload.js';

import {applyForJob, getCandidateApplications, getEmployerApplications, updateApplicationStatus} from '../controllers/applicationController.js';

const router = express.Router();

// ROUTE 1: Candidate applies for a job
router.post('/apply/:jobId', verifyUser, upload.single('resume'), applyForJob);

// ROUTE 2: Candidate views their own applications
router.get('/candidate-applications', verifyUser, getCandidateApplications);

// ROUTE 3: Employer views all applications received for their jobs
router.get('/employer-applications', verifyUser, getEmployerApplications);

// ROUTE 4: Employer updates status of an application
router.put('/update-status/:applicationId', verifyUser, updateApplicationStatus);

export default router;