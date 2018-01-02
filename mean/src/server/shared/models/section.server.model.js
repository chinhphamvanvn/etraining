'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Section Schema
 */
var EditionSectionSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Section name',
    trim: true
  },
  edition: {
    type: Schema.ObjectId,
    ref: 'CourseEdition'
  },
  parent: {
    type: Schema.ObjectId,
    ref: 'EditionSection'
  },
  order: {
    type: Number,
    default: 0
  },
  visible: {
    type: Boolean,
    default: true
  },
  hasContent: {
    type: Boolean
  },
  contentType: {
    type: String,
    enum: ['html', 'test', 'video', 'survey', 'exercise', 'practice', 'scorm']
  },
  html: {
    type: Schema.ObjectId,
    ref: 'Html'
  },
  scorm: {
      type: Schema.ObjectId,
      ref: 'Scorm'
    },
  survey: {
    type: Schema.ObjectId,
    ref: 'Exam'
  },
  quiz: {
    type: Schema.ObjectId,
    ref: 'Exam'
  },
  exercise: {
    type: Schema.ObjectId,
    ref: 'Exercise'
  },
  practice: {
    type: Schema.ObjectId,
    ref: 'Practice'
  },
  video: {
    type: Schema.ObjectId,
    ref: 'Video'
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

mongoose.model('EditionSection', EditionSectionSchema);
