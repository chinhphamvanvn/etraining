'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Message Schema
 */
var MessageSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill Message name',
    trim: true
  },
  content: {
      type: String,
      default: ''
    },
  type: {
      type: String,
      enum: ['alert', 'message'],
      default: 'alert',
    },
  level: {
      type: String,
      enum: ['warning', 'info', 'danger', 'success'],
      default: 'info',
    },
    sender: {
        type: Schema.ObjectId,
        ref: 'User'
      },
    recipient: {
        type: Schema.ObjectId,
        ref: 'User'
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

mongoose.model('Message', MessageSchema);
