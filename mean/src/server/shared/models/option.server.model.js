'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Option Schema
 */
var OptionSchema = new Schema({
  content: {
    type: String,
    default: '',
    trim: true
  },
  group: {
    type: String
  },
  imageUrl: {
    type: String
  },
  videoUrl: {
    type: String
  },
  audioUrl: {
    type: String
  },
  xmlData: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  order: {
    type: Number,
    default: 1
  },
  mime: {
    type: String,
    enum: ['txt', 'pic', 'video', 'audio'],
    default: 'txt'
  },
  question: {
    type: Schema.ObjectId,
    ref: 'Question'
  }
});

mongoose.model('Option', OptionSchema);
