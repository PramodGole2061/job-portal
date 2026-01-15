const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const JobSchema = new Schema({
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

module.exports = mongoose.model('job', JobSchema);