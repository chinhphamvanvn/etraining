'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Classroom Schema
 */
var ClassroomSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Classroom name',
    trim: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  course: {
    type: Schema.ObjectId,
    ref: 'Course'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Classroom', ClassroomSchema);
