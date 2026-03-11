import { strict } from "assert";
import mongoose from "mongoose";
import { type } from "os";

const { Schema } = mongoose;

const JobSchema = new Schema({
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employer',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        default: "Not Disclosed"
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const Job = mongoose.model('Job', JobSchema);
export default Job;