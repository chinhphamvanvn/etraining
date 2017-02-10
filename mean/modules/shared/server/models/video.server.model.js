'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Video Schema
 */
var VideoSchema = new Schema({
    transcript: {
        type: String,
        trim: true
    },
    videoURL: {
        type: String,
        trim: true
    },
    videoCaptionURL: {
        type: String,
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

mongoose.model('Video', VideoSchema);
