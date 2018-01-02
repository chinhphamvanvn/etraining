'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Group Schema
 */
var GroupSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Group name',
    trim: true
  },
  parent: {
    type: Schema.ObjectId,
    ref: 'Group'
  },
  category: {
    type: String,
    enum: ['organization', 'competency', 'course', 'library', 'question'],
    default: ''
  },
  order: {
    type: Number
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  code: {
    type: String,
    default: ''
  }
});

mongoose.model('Group', GroupSchema);
