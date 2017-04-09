'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Course Schema
 */
var CourseSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Course name',
    trim: true
  },
  primaryEdition: {
    type: Schema.ObjectId,
    ref: 'CourseEdition'
  },
  summary: {
    type: String,
    default: '',
    trim: true
  },
  detail: {
    type: String,
    default: '',
    trim: true
  },
  code: {
    type: String,
    default: '',
    trim: true
  },
  phone: {
    type: String,
    default: '',
    trim: true
  },
  email: {
    type: String,
    default: '',
    trim: true
  },
  level: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  model: {
    type: String,
    enum: ['self-paced', 'group'],
    default: 'self-paced'
  },
  status: {
    type: String,
    enum: ['draft', 'available', 'unavailable'],
    default: 'draft'
  },
  enrollPolicy: {
    type: String,
    enum: ['open', 'censor'],
    default: 'open'
  },
  enrollStatus: {
    type: Boolean,
    default: false
  },
  enrollStartDate: {
    type: Date
  },
  enrollEndDate: {
    type: Date
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  displayMode: {
    type: String,
    enum: ['open', 'login', 'enroll'],
    default: 'open'
  },
  logoURL: {
    type: String,
    default: '/files/logo/uploads/place-holder.png'
  },
  group: {
    type: Schema.ObjectId,
    ref: 'Group'
  },
  prequisites: {
    type: [{
      type: Schema.ObjectId,
      ref: 'Course'
    }]
  },
  competencies: {
    type: [{
      type: Schema.ObjectId,
      ref: 'Competency'
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

/**
 * Validate course
 */
CourseSchema.methods.validateEnrollment = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    var now = new Date();
    if (self.status !== 'available')
      reject({
        message: 'Course not available'
      });
    else if (!self.enrollStatus)
      reject({
        message: 'Course enrollment is closed'
      });
    else if (self.endDate && self.endDate.getTime() < now.getTime())
      reject({
        message: 'Course end date is less than now'
      });
    else if (self.enrollEndDate && self.enrollEndDate.getTime() < now.getTime())
      reject({
        message: 'Course enrollment end date is less than now'
      });
    else if (self.enrollStartDate && self.enrollStartDate.getTime() > now.getTime())
      reject({
        message: 'Course enrollment start date is greater than now'
      });
    else
      resolve();
  });
};

mongoose.model('Course', CourseSchema);
