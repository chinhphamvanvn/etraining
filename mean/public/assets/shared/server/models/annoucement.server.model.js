'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Annoucement Schema
 */
var AnnoucementSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill Annoucement title',
    trim: true
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  published: {
    type: Boolean,
    default: false
  },
  level: {
    type: String,
    enum: ['info', 'warning', 'primary'],
    default: 'info'
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

mongoose.model('Annoucement', AnnoucementSchema);
