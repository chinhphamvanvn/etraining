'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Schedule Schema
 */
var ScheduleSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Schedule name',
    trim: true
  },
  status: {
      type: String,
      enum: ['draft','available', 'unavailable'],
      default: 'draft'
  },
  color: {
      type: String  
    },
    benchmark: {
        type: Number,
        default: 50
      },
  start: {
    type: Date,
    default: Date.now
  },
  end: {
    type: Date,
    default: Date.now
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

mongoose.model('Schedule', ScheduleSchema);
