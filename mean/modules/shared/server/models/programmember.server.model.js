'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Programmember Schema
 */
var ProgramMemberSchema = new Schema({
	program: {
	      type: Schema.ObjectId,
	      ref: 'CourseProgram'
	  },
	  member: {
	      type: Schema.ObjectId,
	      ref: 'User'
	  },
	  enrollmentStatus: {
	      type: String,
	      enum: ['registered','in-study','completed'],
	  },
	  status: {
	      type: String,
	      enum: ['active','withdrawn', 'suspended'],
	  },
	  role: {
	      type: String,
	      enum: ['manager','student'],
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

mongoose.model('ProgramMember', ProgramMemberSchema);
