'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Exercise Schema
 */
var ExerciseSchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true
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
  created: {
    type: Date,
    default: Date.now
  },
  questions: {
    type: [{
      id: {
        type: Schema.ObjectId,
        ref: 'Question'
      },
      order: {
        type: Number,
        default: 1
      }
    }]
  },
  type: {
    type: String,
    enum: ['homework', 'project'],
    default: 'homework'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Exercise', ExerciseSchema);
