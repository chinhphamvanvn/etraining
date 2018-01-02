'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Endpoint Schema
 */
var EndpointSchema = new Schema({
  prefix: {
    type: String,
    default: '',
    required: 'Please fill Endpoint prefix',
    trim: true
  },
  name: {
    type: String,
    default: '',
    required: 'Please fill Endpoint name',
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

mongoose.model('Endpoint', EndpointSchema);
