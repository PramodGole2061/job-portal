const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');
const { Schema } = mongoose;

// copy this from mongoose => schema
const UserSchema = new Schema({
  name: {
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
  role: {
    type: String,
    required: true,
    enum: ['candidate', 'employer'], // Only these two values are allowed
    default: 'candidate'
  },
  date: {
    type: Date,
    default: Date.now
  },
});
const user = mongoose.model('users', UserSchema);
module.exports = user;
