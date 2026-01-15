const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const CandidateSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNumber: { type: String, required: true },
    jobPreference: { type: String, required: true },
    role: { type: String, default: 'candidate' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('candidate', CandidateSchema);