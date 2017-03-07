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
            course: {
                type: Schema.ObjectId,
                ref: 'Course'
            },
            edition: {
                type: Schema.ObjectId,
                ref: 'CourseEdition'
            },
            member: {
                type: Schema.ObjectId,
                ref: 'CourseMember'
            },
            source: {
                type: String,
                enum: ['exam','course'],
                default: 'exam'
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
