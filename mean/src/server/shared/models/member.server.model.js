'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Member Schema
 */
var CourseMemberSchema = new Schema({
  course: {
    type: Schema.ObjectId,
    ref: 'Course'
  },
  edition: {
    type: Schema.ObjectId,
    ref: 'CourseEdition'
  },
  classroom: {
    type: Schema.ObjectId,
    ref: 'Classroom'
  },
  member: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  enrollmentStatus: {
    type: String,
    enum: ['registered', 'in-study', 'completed']
  },
  status: {
    type: String,
    enum: ['active', 'withdrawn', 'suspended']
  },
  role: {
    type: String,
    enum: ['teacher', 'student']
  },
  registerAgent: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  registered: {
    type: Date,
    default: Date.now
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

mongoose.model('CourseMember', CourseMemberSchema);
