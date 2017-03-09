'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Conference Schema
 */
var ConferenceSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Conference name',
    trim: true
  },
  provider: {
      type: String,
      enum: ['vietinterview'],
      default: 'vietinterview'
    },
  classroom: {
      type: Schema.ObjectId,
      ref: 'Classroom'
  },
  meetingId: {
      type: String,
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

mongoose.model('Conference', ConferenceSchema);
