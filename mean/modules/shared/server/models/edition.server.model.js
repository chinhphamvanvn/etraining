'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Edition Schema
 */
var CourseEditionSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Edition name',
    trim: true
  },
  course: {
    type: Schema.ObjectId,
    ref: 'Course'
  },
  published: {
    type: Boolean,
    default: false
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

mongoose.model('CourseEdition', CourseEditionSchema);
