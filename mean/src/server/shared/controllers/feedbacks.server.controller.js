'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Feedback = mongoose.model('Feedback'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Feedback
 */
exports.create = function(req, res) {
  var feedback = new Feedback(req.body);
  feedback.user = req.user;

  feedback.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(feedback);
    }
  });
};

/**
 * Show the current Feedback
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var feedback = req.feedback ? req.feedback.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  feedback.isCurrentUserOwner = req.user && feedback.user && feedback.user._id.toString() === req.user._id.toString();

  res.jsonp(feedback);
};

/**
 * Update a Feedback
 */
exports.update = function(req, res) {
  var feedback = req.feedback;

  feedback = _.extend(feedback, req.body);

  feedback.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(feedback);
    }
  });
};

/**
 * Delete an Feedback
 */
exports.delete = function(req, res) {
  var feedback = req.feedback;

  feedback.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(feedback);
    }
  });
};

/**
 * List of Feedbacks
 */
exports.list = function(req, res) {
  Feedback.find().sort('-created').populate('user', 'displayName').exec(function(err, feedbacks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(feedbacks);
    }
  });
};

exports.byAttempt = function(req, res) {
  Feedback.find({attempt:req.attempt._id}).sort('-created').populate('user', 'displayName').populate({
    path: 'teacher',
    populate: {
      path: 'member'
    }}).exec(function(err, feedbacks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(feedbacks);
    }
  });
};

/**
 * Feedback middleware
 */
exports.feedbackByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Feedback is invalid'
    });
  }

  Feedback.findById(id).populate('user', 'displayName').exec(function (err, feedback) {
    if (err) {
      return next(err);
    } else if (!feedback) {
      return res.status(404).send({
        message: 'No Feedback with that identifier has been found'
      });
    }
    req.feedback = feedback;
    next();
  });
};
