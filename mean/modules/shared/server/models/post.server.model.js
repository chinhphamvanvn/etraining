'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Post Schema
 */
var ForumPostSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Post name',
    trim: true
  },
  topic: {
      type: Schema.ObjectId,
      ref: 'ForumTopic'
    },
  parent: {
    type: Schema.ObjectId,
    ref: 'ForumPost'
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

mongoose.model('ForumPost', ForumPostSchema);
