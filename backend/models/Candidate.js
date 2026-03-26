import { strict } from "assert";
import mongoose from "mongoose";
import { type } from "os";

const { Schema } = mongoose;

const CandidateSchema = new Schema({
    firstName: {
        type: String, 
        required: true 
    },
    lastName: { 
        type: String,
         required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    contactNumber: {
         type: String, 
         required: true 
    },
    jobPreference: { 
        type: String, 
        required: true 
    },
    skills: {
        type: [String],
        default: []
    },
    education:[
        {
            degree: { type: String, required: true },
            institution: { type: String, required: true },
            passingYear: { type: String, required: true }
        }
    ],
    role: { 
        type: String,
         default: 'candidate'
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
});

const Candidate = mongoose.model('Candidate', CandidateSchema);
export default Candidate;