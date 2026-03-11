import Job from '../models/Job.js';
import {body, validationResult} from 'express-validator';

export const fetchalljobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json({ success: true, jobs });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}

export const addjob = async (req, res) => {
    try {
        // verifyUser decoded the token and put the role in req.user.role
        if (req.user.role !== 'employer') {
            return res.status(403).json({ 
                success: false, 
                error: "Forbidden: Only employers can post jobs." 
            });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { title, company, description, location, salary } = req.body;
        
        const job = new Job({
            title, 
            company, 
            description, 
            location, 
            salary,
            employer: req.user.id
        });

        const savedJob = await job.save();
        res.json({ success: true, job: savedJob });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}


export const updatejob = async (req, res) => {
    const { title, description, location, salary, company } = req.body;

    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ success: false, error: "Only employers can update jobs." });
        }

        const newJob = {};
        if (title) newJob.title = title;
        if (description) newJob.description = description;
        if (location) newJob.location = location;
        if (salary) newJob.salary = salary;
        if (company) newJob.company = company;

        let job = await Job.findById(req.params.id);
        
        if (!job) { 
            return res.status(404).json({ success: false, error: "Job Not Found" });
        }

        if (!job.employer) {
            return res.status(400).json({ success: false, error: "This job post is corrupted (missing employer field)." });
        }

        if (job.employer.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: "Not Allowed: This is not your job post." });
        }

        job = await Job.findByIdAndUpdate(req.params.id, { $set: newJob }, { new: true });
        res.json({ success: true, job });

    } catch (error) {
        console.error("Crashed with error:", error.message); 
        res.status(500).json({ success: false, error: error.message });
    }
}

export const deletejob = async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ success: false, error: "Forbidden: Only employers can delete jobs." });
        }

        let job = await Job.findById(req.params.id);
        if (!job) { return res.status(404).json({ success: false, error: "Job Not Found" }) }

        if (job.employer.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: "Not Allowed: You can only delete your own job posts." });
        }

        await Job.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Job has been deleted successfully" });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}