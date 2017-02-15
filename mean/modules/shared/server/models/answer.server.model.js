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
    option: {
        type: Schema.ObjectId,
        ref: 'Option'
    },
    options: {
        type: [
               {
                type: Schema.ObjectId,
                ref: 'Option'
               }
               ]
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
