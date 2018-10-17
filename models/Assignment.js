const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const AssignmentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: 'students'
    }
  ],
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  grade: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('assignments', AssignmentSchema);
