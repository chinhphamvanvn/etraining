'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Certificate Schema
 */
var CertificateSchema = new Schema({
  course: {
    type: Schema.ObjectId,
    ref: 'Course'
  },
  edition: {
    type: Schema.ObjectId,
    ref: 'CourseEdition'
  },
  member: {
    type: Schema.ObjectId,
    ref: 'CourseMember'
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  authorizer: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  base64data: {
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

mongoose.model('Certificate', CertificateSchema);
