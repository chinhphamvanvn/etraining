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
    enum: ['skill','attitude','knowledge'],
    default: 'skill'
  },
  gradeModel: {
      type: String,
      enum: ['level','true-false'],
      default: 'level'
    },
    levels: {
        type: [{
            name: {
                type: String,
            },
            order: {
                type: Number,
                default: 1
            }
        }]
     },
    granted: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Competency', CompetencySchema);
