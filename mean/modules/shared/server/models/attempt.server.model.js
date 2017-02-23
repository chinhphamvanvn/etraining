'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Attempt Schema
 */
var AttemptSchema = new Schema({
    member: {
        type: Schema.ObjectId,
        ref: 'CourseMember'
    },
    course: {
        type: Schema.ObjectId,
        ref: 'Course'
    },
    edition: {
        type: Schema.ObjectId,
        ref: 'CourseEdition'
    },
  section: {
      type: Schema.ObjectId,
      ref: 'EditionSection'
  },
  
  answers: {
      type: [{
          type: Schema.ObjectId,
          ref: 'Answer'
        }]
  },
  start: {
    type: Date,
    default: Date.now
  },
  end: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['initial', 'completed', 'pending', 'cancelled'],
    default: 'initial'
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

mongoose.model('CourseAttempt', AttemptSchema);

