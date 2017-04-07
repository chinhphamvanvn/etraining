'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Participant Schema
 */
var ConferenceParticipantSchema = new Schema({
  memberId: {
    type: String
  },
  meetingId: {
    type: String
  },
  loginURL: {
    type: String
  },
  email: {
    type: String
  },
  name: {
    type: String,
    default: ''
  },
  conference: {
    type: Schema.ObjectId,
    ref: 'Conference'
  },
  member: {
    type: Schema.ObjectId,
    ref: 'CourseMember'
  },
  isPresenter: {
    type: Boolean,
    default: false
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

mongoose.model('ConferenceParticipant', ConferenceParticipantSchema);
