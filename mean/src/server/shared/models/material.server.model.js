'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Material Schema
 */
var CourseMaterialSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Material name',
    trim: true
  },
  edition: {
    type: Schema.ObjectId,
    ref: 'CourseEdition'
  },
  downloadURL: {
    type: String
  },
  filename: {
    type: String
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

mongoose.model('CourseMaterial', CourseMaterialSchema);
