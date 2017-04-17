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
    default: 'easy'
  },
  created: {
    type: Date,
    default: Date.now
  },
  imageUrl: {
    type: String
  },
  svgData: {
    type: String
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
    }]
  },
  optionMappings: {
    type: [{
      source: {
        type: Schema.ObjectId,
        ref: 'Option'
      },
      target: {
        type: Schema.ObjectId,
        ref: 'Option'
      }
    }]
  },
  type: {
    type: String,
    enum: ['mc', 'sc', 'tf', 'fb', 'ext', 'dnd', 'pic', 'as'],
  },
  optional: {
    type: Boolean,
    default: false
  },
  grouped: {
    type: Boolean,
    default: false
  },
  subQuestions: {
    type: [{
      type: Schema.ObjectId,
      ref: 'Question'
    }]
  }
});

mongoose.model('Question', QuestionSchema);
