'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Candidate Schema
 */
var CandidateSchema = new Schema({
    exam: {
        type: Schema.ObjectId,
        ref: 'Exam'
    },
    schedule: {
        type: Schema.ObjectId,
        ref: 'Schedule'
    },
    candidate: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    enrollmentStatus: {
        type: String,
        enum: ['registered','inprogress','completed'],
    },
    status: {
        type: String,
        enum: ['active','withdrawn', 'suspended'],
    },
    role: {
        type: String,
        enum: ['teacher','student'],
    },
    registerAgent: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    registered: {
        type: Date,
        default: Date.now
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

mongoose.model('Candidate', CandidateSchema);
