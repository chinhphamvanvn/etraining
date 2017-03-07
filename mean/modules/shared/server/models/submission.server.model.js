'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Submission Schema
 */
var SubmissionSchema = new Schema({
    candidate: {
        type: Schema.ObjectId,
        ref: 'ExamCandidate'
    },
    exam: {
        type: Schema.ObjectId,
        ref: 'Exam'
    },
    schedule: {
        type: Schema.ObjectId,
        ref: 'Schedule'
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

mongoose.model('Submission', SubmissionSchema);
