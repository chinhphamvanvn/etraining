'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Exercise = mongoose.model('Exercise'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Exercise
 */
exports.create = function(req, res) {
  var exercise = new Exercise(req.body);
  exercise.user = req.user;

  exercise.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(exercise);
    }
  });
};

/**
 * Show the current Exercise
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var exercise = req.exercise ? req.exercise.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  exercise.isCurrentUserOwner = req.user && exercise.user && exercise.user._id.toString() === req.user._id.toString();

  res.jsonp(exercise);
};

/**
 * Update a Exercise
 */
exports.update = function(req, res) {
  var exercise = req.exercise;

  exercise = _.extend(exercise, req.body);

  exercise.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(exercise);
    }
  });
};

/**
 * Delete an Exercise
 */
exports.delete = function(req, res) {
  var exercise = req.exercise;

  exercise.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(exercise);
    }
  });
};

/**
 * List of Exercises
 */
exports.list = function(req, res) {
  Exercise.find().sort('-created').populate('user', 'displayName').exec(function(err, exercises) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(exercises);
    }
  });
};

/**
 * Exercise middleware
 */
exports.exerciseByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Exercise is invalid'
    });
  }

  Exercise.findById(id).populate('user', 'displayName').exec(function (err, exercise) {
    if (err) {
      return next(err);
    } else if (!exercise) {
      return res.status(404).send({
        message: 'No Exercise with that identifier has been found'
      });
    }
    req.exercise = exercise;
    next();
  });
};
