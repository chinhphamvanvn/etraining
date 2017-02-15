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
  name: {
    type: String,
    default: '',
    required: 'Please fill Topic name',
    trim: true
  },
  forum: {
      type: Schema.ObjectId,
      ref: 'Forum'
    },
  updated: {
      type: Date,
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
