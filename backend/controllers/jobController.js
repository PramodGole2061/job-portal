import Job from '../models/Job.js';
import {body, validationResult} from 'express-validator';
import fs from 'fs';
import Application from '../models/Application.js';

export const fetchalljobs = async (req, res) => {
    try {
        const {keyword, location, company, category} = req.query;
        
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        let query = {};

        if(keyword){
            query.$or =[
                {title: {$regex: keyword, $options: 'i'}},
                {description: {$regex: keyword, $options: 'i'}},
                {company: {$regex: keyword, $options: 'i'}}
            ];
        }

        if(location){
            query.location = {$regex: location, $options: 'i'};
        }

        if(company){
            query.company = {$regex: company, $options: 'i'};
        }

         if(category){
            query.category = {$regex: category, $options: 'i'};
        }

        const jobs = await Job.find(query).sort({date: sortDirection}).skip(startIndex).limit(limit);

        const totalJobs = await Job.countDocuments(query);

        res.json({success: true, count: jobs.length,totalJobs,jobs});

    } catch(error){
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

        const {title, company, description, location, salary, category, applicationDeadline} = req.body;
        
        const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')

        const job = new Job({
            title, 
            company, 
            description, 
            location, 
            salary,
            slug,
            category,
            applicationDeadline,
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
    if(req.params.employerId !== req.user.id){
        return res.status(401).json("You are not authorized to update this job!");
    }

    const {title, description, location, salary, company, category, applicationDeadline} = req.body;

    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ success: false, error: "Only employers can update jobs." });
        }

        let slug;
        if (req.body.title) {
            slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
        }

        const newJob = {};
        if (title) newJob.title = title;
        if (description) newJob.description = description;
        if (location) newJob.location = location;
        if (salary) newJob.salary = salary;
        if (company) newJob.company = company;
        if (category) newJob.category = category;
        if (applicationDeadline) newJob.applicationDeadline = applicationDeadline;

        let job = await Job.findById(req.params.postId);
        
        if (!job) { 
            return res.status(404).json({ success: false, error: "Job Not Found" });
        }

        if (!job.employer) {
            return res.status(400).json({ success: false, error: "This job post is corrupted (missing employer field)." });
        }

        if (job.employer.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: "Not Allowed: This is not your job post." });
        }

        job = await Job.findByIdAndUpdate(req.params.postId, { $set: newJob, ...(slug && { slug })  }, { new: true });
        res.json({ success: true, job });

    } catch (error) {
        console.error("Crashed with error:", error.message); 
        res.status(500).json({ success: false, error: error.message });
    }
}

export const deletejob = async (req, res) => {
    if(req.params.employerId !== req.user.id){
        return res.status(401).json("You are not authorized to delete this job!");
    }
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ success: false, error: "Forbidden: Only employers can delete jobs." });
        }

        let job = await Job.findById(req.params.postId);
        if (!job) { return res.status(404).json({ success: false, error: "Job Not Found" }) }

        if (job.employer.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: "Not Allowed: You can only delete your own job posts." });
        }

        const applications = await Application.find({ job: req.params.postId });

        // loop through each application and delete the physical pdf file from the server
        applications.forEach(app => {
            if (app.resume && fs.existsSync(app.resume)) {
                fs.unlinkSync(app.resume);
            }
        });

        await Application.deleteMany({ job: req.params.postId });

        await Job.findByIdAndDelete(req.params.postId);
        res.json({ success: true, message: "Job has been deleted successfully" });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}