import Application from '../models/Application.js';
import Job from '../models/Job.js';

export const applyForJob = async (req, res) => {
    try {
        if (req.user.role !== 'candidate') {
            return res.status(403).json({success: false, error: "Only candidates can apply for jobs."});
        }

        const jobId = req.params.jobId;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({success: false, error: "Job not found."});
        }

        const currentDate = new Date();
        const deadlineDate = new Date(job.applicationDeadline);

        if (currentDate > deadlineDate) {
            return res.status(400).json({success: false, error: "The application deadline for this job has passed. You can no longer apply."});
        }

        const existingApplication = await Application.findOne({ job: jobId, candidate: req.user.id });
        if (existingApplication) {
            return res.status(400).json({success: false, error: "You have already applied for this job."});
        }

        if (!req.file) {
            return res.status(400).json({success: false, error: "Please attach your CV to apply for this job."});
        }

        // Get the file path
        const resumePath = req.file.path.replace(/\\/g, "/");

        const application = new Application({
            job: jobId,
            candidate: req.user.id,
            employer: job.employer,
            resume: resumePath
        });

        const savedApplication = await application.save();
        res.status(200).json({success: true, message: "Application submitted successfully!", application: savedApplication });

    } catch (error) {
        console.error(error.message);
        if (error.message.includes('Invalid file type')) {
            return res.status(400).json({ success: false, error: error.message });
        }
        res.status(500).send("Internal Server Error");
    }
};

// Candidate views their own applications
export const getCandidateApplications = async (req, res) => {
    try {
        if (req.user.role !== 'candidate') {
            return res.status(403).json({success: false, error: "Access denied."});
        }

        const applications = await Application.find({ candidate: req.user.id })
            .populate('job', 'title company location salary')
            .sort({ appliedDate: -1 });

        res.json({success: true, applications});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
};

// Employer views applicants for their jobs
export const getEmployerApplications = async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({success: false, error: "Access denied."});
        }

        const applications = await Application.find({ employer: req.user.id })
            .populate('candidate', 'firstName lastName email contactNumber')
            .populate('job', 'title')
            .sort({ appliedDate: -1 });

        res.json({success: true, applications});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
};

// Employer updates application status (Shortlisting/Rejecting)
export const updateApplicationStatus = async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({success: false, error: "Access denied."});
        }

        const { status } = req.body;
        const validStatuses = ['Pending', 'Reviewed', 'Shortlisted', 'Rejected'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({success: false, error: "Invalid status value."});
        }

        let application = await Application.findById(req.params.applicationId);

        if (!application) {
            return res.status(404).json({success: false, error: "Application not found."});
        }

        if (application.employer.toString() !== req.user.id) {
            return res.status(401).json({success: false, error: "Not authorized to update this application."});
        }

        //update state
        application.status = status;
        await application.save();

        res.json({success: true, message: `Application status updated to ${status}`, application});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}