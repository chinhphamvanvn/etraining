'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Exam Schema
 */
var ExamSchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true
      },
      description: {
        type: String,
        default: '',
        trim: true
      },
      instruction: {
        type: String,
        default: '',
        trim: true
      },
      logoURL: {
        type: String
      },
      duration: {
        type: Number,
        default: 25
      },
      maxAttempt: {
        type: Number,
        default: 1
      },
      benchmark: {
        type: Number,
        default: 50
      },
      published: {
        type: Boolean,
        default: false,
      },
      questions: {
          type: [{
              id: {
                  type: Schema.ObjectId,
                  ref: 'Question'
              },
              order: {
                  type: Number,
                  default: 1
              },
              score: {
                  type: Number,
                  default: 1
              }
          }]
       },
      questionSelection: {
        type: String,
        enum: ['manual', 'auto'],
        default: 'manual'
      },
      questionCategory: {
        type: Schema.ObjectId,
        ref: 'Group'
      },
      questionCategories: {
        type: [{
          id: {
            type: Schema.ObjectId,
            ref: 'Group'
          },
          title: {
            type: String
          },
          level: {
            type: String
          },
          numberQuestion: {
            type: Number,
            default: 1
          }
        }]
      },
      questionNumber: {
        type: Number,
        default: 0
      },
      questionLevel: {
        type: String,
      },
      allowNavigate: {
        type: Boolean,
        default: true
      },
      showAnswer: {
        type: Boolean,
        default: false
      },
      shuffleOption: {
          type: Boolean,
          default: false
        },
      earlySubmitPrevention: {
          type: Boolean,
          default: false
        },
        earlySubmit: {
            type: Number,
            default: 1
          },
          preDueWarning: {
              type: Boolean,
              default: false
            },
            preDue: {
                type: Number,
                default: 1
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

mongoose.model('Exam', ExamSchema);
