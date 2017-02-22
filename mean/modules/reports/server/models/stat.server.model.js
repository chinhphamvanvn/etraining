'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Stat Schema
 */
var StatSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Stat name',
    trim: true
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

mongoose.model('Stat', StatSchema);
