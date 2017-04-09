'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Setting Schema
 */
var SettingSchema = new Schema({
  name: {
    type: String,
    default: ''
  },
  valueString: {
    type: String,
    default: '',
    trim: true
  },
  valueNumber: {
    type: Number
  },
  valueBoolean: {
    type: Boolean
  },
  code: {
    type: String,
    unique: true
  },
  category: {
    type: String
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

mongoose.model('Setting', SettingSchema);
