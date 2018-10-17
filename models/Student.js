const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const StudentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  assignments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'assignments'
    }
  ],
  name: {
    type: String,
    required: true
  },
  average: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('students', StudentSchema);
