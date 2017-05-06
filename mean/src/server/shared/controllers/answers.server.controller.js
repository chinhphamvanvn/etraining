'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Answer = mongoose.model('Answer'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Answer
 */
exports.create = function(req, res) {
  var answer = new Answer(req.body);
  answer.user = req.user;

  answer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(answer);
    }
  });
};

/**
 * Show the current Answer
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var answer = req.answer ? req.answer.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  answer.isCurrentUserOwner = req.user && answer.user && answer.user._id.toString() === req.user._id.toString();

  res.jsonp(answer);
};

/**
 * Update a Answer
 */
exports.update = function(req, res) {
  var answer = req.answer;

  answer = _.extend(answer, req.body);

  answer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(answer);
    }
  });
};

/**
 * Delete an Answer
 */
exports.delete = function(req, res) {
  var answer = req.answer;

  answer.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(answer);
    }
  });
};

/**
 * List of Answers
 */
exports.list = function(req, res) {
  Answer.find().sort('-created').populate('user', 'displayName').populate('question').populate('options').populate('subAnswers').exec(function(err, answers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(answers);
    }
  });
};

exports.listByAttempt = function(req, res) {
  Answer.find({
    attempt: req.attempt._id
  }).sort('-created').populate('user', 'displayName').populate('question').populate('options').populate('subAnswers').exec(function(err, answers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(answers);
    }
  });
};

/**
 * Answer middleware
 */
exports.answerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Answer is invalid'
    });
  }

  Answer.findById(id).populate('user', 'displayName').populate('question').populate('options').populate('subAnswers').exec(function(err, answer) {
    if (err) {
      return next(err);
    } else if (!answer) {
      return res.status(404).send({
        message: 'No Answer with that identifier has been found'
      });
    }
    req.answer = answer;
    next();
  });
};


