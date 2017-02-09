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
    candidate: {
        type: Schema.ObjectId,
        ref: 'User'
    },
  exam: {
      type: Schema.ObjectId,
      ref: 'Exam'
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

mongoose.model('Attempt', AttemptSchema);

