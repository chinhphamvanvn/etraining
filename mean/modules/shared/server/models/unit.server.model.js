'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Unit Schema
 */
var EditionUnitSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Unit name',
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

mongoose.model('EditionUnit', EditionUnitSchema);
