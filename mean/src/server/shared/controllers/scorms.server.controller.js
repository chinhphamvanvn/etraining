'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Scorm = mongoose.model('Scorm'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Scorm
 */
exports.create = function(req, res) {
  var scorm = new Scorm(req.body);
  scorm.user = req.user;

  scorm.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(scorm);
    }
  });
};

/**
 * Show the current scorm
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var scorm = req.scorm ? req.scorm.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  scorm.isCurrentUserOwner = req.user && scorm.user && scorm.user._id.toString() === req.user._id.toString();

  res.jsonp(scorm);
};

/**
 * Update a Html
 */
exports.update = function(req, res) {
  var scorm = req.scorm;

  scorm = _.extend(scorm, req.body);

  scorm.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(scorm);
    }
  });
};

/**
 * Delete an Html
 */
exports.delete = function(req, res) {
  var scorm = req.scorm;

  scorm.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(scorm);
    }
  });
};

/**
 * List of Scorms
 */
exports.list = function(req, res) {
  Scorm.find().sort('-created').populate('user', 'displayName').exec(function(err, scorms) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(scorms);
    }
  });
};

/**
 * Html middleware
 */
exports.scormByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Scorm is invalid'
    });
  }

  Scorm.findById(id).populate('user', 'displayName').exec(function(err, scorm) {
    if (err) {
      return next(err);
    } else if (!scorm) {
      return res.status(404).send({
        message: 'No Html with that identifier has been found'
      });
    }
    req.scorm = scorm;
    next();
  });
};
