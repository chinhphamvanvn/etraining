'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Competency Schema
 */
var CompetencySchema = new Schema({
  name: {
    type: String,
    default: ''
  },
  group: {
    type: Schema.ObjectId,
    ref: 'Group'
  },
  category: {
    type: String,
    enum: ['skill', 'attitude', 'knowledge'],
    default: 'skill'
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

mongoose.model('Competency', CompetencySchema);
