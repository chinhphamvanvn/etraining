'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Medium Schema
 */
var LibraryMediumSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Medium name',
    trim: true
  },
  description: {
      type: String,
    },
   imageURL: {
        type: String,
       default: '/media/image/uploads/place-holder.png'
      },
      published: {
          type: Boolean,
         default: false
        },
  group: {
      type: Schema.ObjectId,
      ref: 'Group'
  },
  mediaType: {
      type: String,
      enum: ['audio', 'video', 'image', 'document'],
    },
    contentURL: {
        type: String,
        trim: true
      },
      filename: {
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

mongoose.model('LibraryMedium', LibraryMediumSchema);
