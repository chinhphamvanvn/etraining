'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  CompetencyAchievement = mongoose.model('CompetencyAchievement'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Achievement
 */
exports.create = function(req, res) {
  var achievement = new CompetencyAchievement(req.body);
  achievement.user = req.user;

  achievement.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(achievement);
    }
  });
};

/**
 * Show the current Achievement
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var achievement = req.achievement ? req.achievement.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  achievement.isCurrentUserOwner = req.user && achievement.user && achievement.user._id.toString() === req.user._id.toString();

  res.jsonp(achievement);
};

/**
 * Update a Achievement
 */
exports.update = function(req, res) {
  var achievement = req.achievement;

  achievement = _.extend(achievement, req.body);

  achievement.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(achievement);
    }
  });
};

/**
 * Delete an Achievement
 */
exports.delete = function(req, res) {
  var achievement = req.achievement;

  achievement.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(achievement);
    }
  });
};

/**
 * List of CompetencyAchievements
 */
exports.list = function(req, res) {
  CompetencyAchievement.find().sort('-created').populate('user', 'displayName').exec(function(err, achievements) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(achievements);
    }
  });
};

/**
 * Achievement middleware
 */
exports.achievementByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Achievement is invalid'
    });
  }

  CompetencyAchievement.findById(id).populate('user', 'displayName').exec(function (err, achievement) {
    if (err) {
      return next(err);
    } else if (!achievement) {
      return res.status(404).send({
        message: 'No Achievement with that identifier has been found'
      });
    }
    req.achievement = achievement;
    next();
  });
};
