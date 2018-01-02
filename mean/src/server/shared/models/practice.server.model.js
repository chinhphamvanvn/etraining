'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Practice Schema
 */
var PracticeSchema = new Schema({
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
  text: {
    type: String,
  },
  audioURL: {
    type: String,
  },
  videoURL: {
    type: String,
  },
  imageURL: {
    type: String,
  },
  fileURL: {
    type: String,
  },
  metadata: {
    type: String,
  },
  type: {
    type: String,
    enum: ['pronounciation']
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Practice', PracticeSchema);
