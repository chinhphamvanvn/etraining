'use strict';

/**
 * Module dependencies.
 */
var _ = require('underscore')._;
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
    read: {
        type: Boolean,
        default: false
      },
  type: {
      type: String,
      enum: ['alert', 'message'],
      default: 'alert',
    },
  level: {
      type: String,
      enum: ['warning', 'primary', 'danger', 'success'],
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

var Message = mongoose.model('Message', MessageSchema);


