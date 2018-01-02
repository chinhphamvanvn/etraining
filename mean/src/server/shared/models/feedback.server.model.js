'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Feedback Schema
 */
var FeedbackSchema = new Schema({
  attempt: {
    type: Schema.ObjectId,
    ref: 'CourseAttempt'
  },
  answer: {
    type: Schema.ObjectId,
    ref: 'Answer'
  },
  teacher: {
    type: Schema.ObjectId,
    ref: 'CourseMember'
  },
  feedbackDate: {
    type: Date,
    default: Date.now
  },
  response: {
    type: String,
    trim: true
  },
  audioUrl: {
    type: String
  },
  videoUrl: {
    type: String,
    trim: true
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

mongoose.model('Feedback', FeedbackSchema);
