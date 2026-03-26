import mongoose from "mongoose";

const { Schema } = mongoose;

const ApplicationSchema = new Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum:['Pending', 'Reviewed', 'Shortlisted', 'Rejected'],
        default: 'Pending'
    },
    appliedDate: {
        type: Date,
        default: Date.now
    }
});

const Application = mongoose.model('Application', ApplicationSchema);
export default Application;