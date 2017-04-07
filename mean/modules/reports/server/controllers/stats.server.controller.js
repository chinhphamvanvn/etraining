'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Stat = mongoose.model('Stat'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Stat
 */
exports.create = function(req, res) {
  var stat = new Stat(req.body);
  stat.user = req.user;

  stat.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stat);
    }
  });
};

/**
 * Show the current Stat
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var stat = req.stat ? req.stat.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  stat.isCurrentUserOwner = req.user && stat.user && stat.user._id.toString() === req.user._id.toString();

  res.jsonp(stat);
};

/**
 * Update a Stat
 */
exports.update = function(req, res) {
  var stat = req.stat;

  stat = _.extend(stat, req.body);

  stat.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stat);
    }
  });
};

/**
 * Delete an Stat
 */
exports.delete = function(req, res) {
  var stat = req.stat;

  stat.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stat);
    }
  });
};

/**
 * List of Stats
 */
exports.list = function(req, res) {
  Stat.find().sort('-created').populate('user', 'displayName').exec(function(err, stats) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stats);
    }
  });
};

/**
 * Stat middleware
 */
exports.statByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Stat is invalid'
    });
  }

  Stat.findById(id).populate('user', 'displayName').exec(function(err, stat) {
    if (err) {
      return next(err);
    } else if (!stat) {
      return res.status(404).send({
        message: 'No Stat with that identifier has been found'
      });
    }
    req.stat = stat;
    next();
  });
};
