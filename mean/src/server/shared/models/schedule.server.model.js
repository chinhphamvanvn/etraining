'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Schedule Schema
 */
var ScheduleSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Schedule name',
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'available', 'unavailable'],
    default: 'draft'
  },
  color: {
    type: String
  },
  start: {
    type: Date,
    default: Date.now
  },
  end: {
    type: Date,
    default: Date.now
  },
  exam: {
    type: Schema.ObjectId,
    ref: 'Exam'
  },
  competencies: {
    type: [{
      type: Schema.ObjectId,
      ref: 'Competency'
    }]
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

mongoose.model('Schedule', ScheduleSchema);
