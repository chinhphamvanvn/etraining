'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Achievement Schema
 */
var CompetencyAchievementSchema = new Schema({
    candidate: {
        type: Schema.ObjectId,
        ref: 'Candidate'
      },
      competency: {
          type: Schema.ObjectId,
          ref: 'Competency'
        },
        schedule: {
            type: Schema.ObjectId,
            ref: 'Schedule'
          },
          exam: {
              type: Schema.ObjectId,
              ref: 'Exam'
            },
         level: {
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

mongoose.model('CompetencyAchievement', CompetencyAchievementSchema);
