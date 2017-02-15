'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Topic Schema
 */
var ForumTopicSchema = new Schema({
  content: {
    type: String,
    default: '',
    required: 'Please fill Topic content',
    trim: true
  },
  forum: {
      type: Schema.ObjectId,
      ref: 'Forum'
    },
  updated: {
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

mongoose.model('ForumTopic', ForumTopicSchema);
