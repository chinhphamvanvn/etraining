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
    default: '',
    required: 'Please fill Competency name',
    trim: true
  },
  group: {
      type: Schema.ObjectId,
      ref: 'Group'
  },
  category: {
    type: String,
    enum: ['skill','attitude','knowledge'],
    default: 'skill'
  },
  gradeModel: {
      type: String,
      enum: ['score','true-false'],
      default: 'score'
    },
  maxScore: {
    type: Number,
    default: 100
  },
  levels: {
      type: [new Schema({
          benchmark: {
              type: Number
          },
          name: {
            type: String
          }
      })]
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
