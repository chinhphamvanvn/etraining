'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Scheme Schema
 */
var GradeSchemeSchema = new Schema({
  edition: {
    type: Schema.ObjectId,
    ref: 'CourseEdition'
  },
  benchmark: {
    type: Number,
    default: 50
  },
  issueCertificate: {
    type: Boolean,
    default: true
  },
  marks: {
      type: [{
          quiz: {
              type: Schema.ObjectId,
              ref: 'EditionSection'
          },
          weight: {
              type: Number,
              default: 0
          }
      }]
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

mongoose.model('GradeScheme', GradeSchemeSchema);
