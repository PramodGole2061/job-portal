import { strict } from "assert";
import mongoose from "mongoose";
import { type } from "os";

const { Schema } = mongoose;

const EmployerSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    companyName: { type: String, required: true },
    primaryPhone: { type: String, required: true },
    industry: { type: String, required: true },
    city: { type: String, required: true },
    location: { type: String, required: true },
    contactPersonName: { type: String, required: true },
    contactPersonMobile: { type: String, required: true },
    contactPersonEmail: { type: String, required: true },
    role: { type: String, default: 'employer' },
    date: { type: Date, default: Date.now }
});

const Employer = mongoose.model('Employer', EmployerSchema);
export default Employer;