'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Question Schema
 */
var QuestionSchema = new Schema({
    title: {
      type: String,
      default: '',
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    level: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'easy',
    },
    created: {
      type: Date,
      default: Date.now
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    category: {
      type: Schema.ObjectId,
      ref: 'Group'
    },
    correctOptions: {
        type: [{
            type: Schema.ObjectId,
            ref: 'Option'
          }],
    type: {
      type: String,
      enum: ['mc', 'sc','tf','fb'],
      default: 'sc',
    }
  });

  mongoose.model('Question', QuestionSchema);
