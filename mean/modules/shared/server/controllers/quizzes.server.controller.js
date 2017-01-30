'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Quiz = mongoose.model('Quiz'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Quiz
 */
exports.create = function(req, res) {
  var quiz = new Quiz(req.body);
  quiz.user = req.user;

  quiz.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(quiz);
    }
  });
};

/**
 * Show the current Quiz
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var quiz = req.quiz ? req.quiz.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  quiz.isCurrentUserOwner = req.user && quiz.user && quiz.user._id.toString() === req.user._id.toString();

  res.jsonp(quiz);
};

/**
 * Update a Quiz
 */
exports.update = function(req, res) {
  var quiz = req.quiz;

  quiz = _.extend(quiz, req.body);

  quiz.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(quiz);
    }
  });
};

/**
 * Delete an Quiz
 */
exports.delete = function(req, res) {
  var quiz = req.quiz;

  quiz.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(quiz);
    }
  });
};

/**
 * List of Quizzes
 */
exports.list = function(req, res) {
  Quiz.find().sort('-created').populate('user', 'displayName').exec(function(err, quizzes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(quizzes);
    }
  });
};

/**
 * Quiz middleware
 */
exports.quizByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Quiz is invalid'
    });
  }

  Quiz.findById(id).populate('user', 'displayName').exec(function (err, quiz) {
    if (err) {
      return next(err);
    } else if (!quiz) {
      return res.status(404).send({
        message: 'No Quiz with that identifier has been found'
      });
    }
    req.quiz = quiz;
    next();
  });
};
