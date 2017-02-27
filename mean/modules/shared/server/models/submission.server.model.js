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
        ref: 'Candidate'
      },
      exam: {
          type: Schema.ObjectId,
          ref: 'Exam'
        },
    answers: {
        type: [{
            type: Schema.ObjectId,
            ref: 'Answer'
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

mongoose.model('Submission', SubmissionSchema);
