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
  competency: {
    type: Schema.ObjectId,
    ref: 'Competency'
  },
  achiever: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  granter: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  issueBy: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    enum: ['exam', 'course', 'program'],
    default: 'exam'
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
