const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const notesSchema = new Schema({
    user:{
    // sets id of another schema type  
    type: mongoose.Schema.Types.ObjectId,
    // reference the another schema type with it's name
    ref: 'users'
  },
  title:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  tag:{
    type: String,
    default: 'General'
  },
  date:{
    type: Date,
    default: Date.now
  }
});
//this will create a collection called notes inside the database used
module.exports = mongoose.model('notes', notesSchema);