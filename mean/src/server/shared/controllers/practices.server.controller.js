'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Practice = mongoose.model('Practice'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Practice
 */
exports.create = function(req, res) {
  var practice = new Practice(req.body);
  practice.user = req.user;

  practice.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(practice);
    }
  });
};

/**
 * Show the current Practice
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var practice = req.practice ? req.practice.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  practice.isCurrentUserOwner = req.user && practice.user && practice.user._id.toString() === req.user._id.toString();

  res.jsonp(practice);
};

/**
 * Update a Practice
 */
exports.update = function(req, res) {
  var practice = req.practice;

  practice = _.extend(practice, req.body);

  practice.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(practice);
    }
  });
};

/**
 * Delete an Practice
 */
exports.delete = function(req, res) {
  var practice = req.practice;

  practice.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(practice);
    }
  });
};

/**
 * List of Practices
 */
exports.list = function(req, res) {
  Practice.find().sort('-created').populate('user', 'displayName').exec(function(err, practices) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(practices);
    }
  });
};

/**
 * Practice middleware
 */
exports.practiceByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Practice is invalid'
    });
  }

  Practice.findById(id).populate('user', 'displayName').exec(function (err, practice) {
    if (err) {
      return next(err);
    } else if (!practice) {
      return res.status(404).send({
        message: 'No Practice with that identifier has been found'
      });
    }
    req.practice = practice;
    next();
  });
};
