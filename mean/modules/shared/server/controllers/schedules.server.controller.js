'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Schedule = mongoose.model('Schedule'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Schedule
 */
exports.create = function(req, res) {
  var schedule = new Schedule(req.body);
  schedule.user = req.user;

  schedule.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(schedule);
    }
  });
};

/**
 * Show the current Schedule
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var schedule = req.schedule ? req.schedule.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  schedule.isCurrentUserOwner = req.user && schedule.user && schedule.user._id.toString() === req.user._id.toString();

  res.jsonp(schedule);
};

/**
 * Update a Schedule
 */
exports.update = function(req, res) {
  var schedule = req.schedule;

  schedule = _.extend(schedule, req.body);

  schedule.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(schedule);
    }
  });
};

/**
 * Delete an Schedule
 */
exports.delete = function(req, res) {
  var schedule = req.schedule;

  schedule.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(schedule);
    }
  });
};

/**
 * List of Schedules
 */
exports.list = function(req, res) {
  Schedule.find().sort('-created').populate('user', 'displayName').exec(function(err, schedules) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(schedules);
    }
  });
};

/**
 * Schedule middleware
 */
exports.scheduleByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Schedule is invalid'
    });
  }

  Schedule.findById(id).populate('user', 'displayName').exec(function (err, schedule) {
    if (err) {
      return next(err);
    } else if (!schedule) {
      return res.status(404).send({
        message: 'No Schedule with that identifier has been found'
      });
    }
    req.schedule = schedule;
    next();
  });
};
