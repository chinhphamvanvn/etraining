'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Answer Schema
 */
var AnswerSchema = new Schema({
  exam: {
    type: Schema.ObjectId,
    ref: 'Exam'
  },
  question: {
    type: Schema.ObjectId,
    ref: 'Question'
  },
  subAnswers: {
    type: [{
      type: Schema.ObjectId,
      ref: 'Answer'
    }]
  },
  isCorrect: {
    type: Boolean
  },
  order: {
    type: Number,
    default: 1
  },
  score: {
    type: Number,
    default: 0
  },
  options: {
    type: [
      {
        type: Schema.ObjectId,
        ref: 'Option'
      }
    ]
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
  text: {
    type: String
  },
  input: {
    type: String,
    default: ''
  },
  start: {
    type: Date,
    default: Date.now
  },
  end: {
    type: Date
  }
});

mongoose.model('Answer', AnswerSchema);
