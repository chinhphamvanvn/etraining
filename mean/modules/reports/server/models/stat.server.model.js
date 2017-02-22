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
  category: {
    type: String
  },
  count: {
      type: Number
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
