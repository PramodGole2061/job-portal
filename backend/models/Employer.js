const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');
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

module.exports = mongoose.model('employer', EmployerSchema);