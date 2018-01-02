'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Competency = mongoose.model('Competency'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Competency
 */
exports.create = function(req, res) {
  var competency = new Competency(req.body);
  competency.user = req.user;

  competency.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(competency);
    }
  });
};

/**
 * Show the current Competency
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var competency = req.competency ? req.competency.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  competency.isCurrentUserOwner = req.user && competency.user && competency.user._id.toString() === req.user._id.toString();

  res.jsonp(competency);
};

/**
 * Update a Competency
 */
exports.update = function(req, res) {
  var competency = req.competency;

  competency = _.extend(competency, req.body);

  competency.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(competency);
    }
  });
};

/**
 * Delete an Competency
 */
exports.delete = function(req, res) {
  var competency = req.competency;

  competency.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(competency);
    }
  });
};

/**
 * List of Competencies
 */
exports.list = function(req, res) {
  Competency.find().sort('-created').populate('user', 'displayName').populate('group').exec(function(err, competencies) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(competencies);
    }
  });
};

exports.listByGroup = function(req, res) {
  Competency.find({
    group: req.group._id
  }).sort('-created').populate('user', 'displayName').populate('group').exec(function(err, competencies) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(competencies);
    }
  });
};

/**
 * Competency middleware
 */
exports.competencyByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Competency is invalid'
    });
  }

  Competency.findById(id).populate('user', 'displayName').populate('group').exec(function(err, competency) {
    if (err) {
      return next(err);
    } else if (!competency) {
      return res.status(404).send({
        message: 'No Competency with that identifier has been found'
      });
    }
    req.competency = competency;
    next();
  });
};
