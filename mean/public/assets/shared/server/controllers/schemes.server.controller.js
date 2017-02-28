'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  GradeScheme = mongoose.model('GradeScheme'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Scheme
 */
exports.create = function(req, res) {
  var scheme = new GradeScheme(req.body);
  scheme.user = req.user;

  scheme.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(scheme);
    }
  });
};

/**
 * Show the current Scheme
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var scheme = req.scheme ? req.scheme.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  scheme.isCurrentUserOwner = req.user && scheme.user && scheme.user._id.toString() === req.user._id.toString();

  res.jsonp(scheme);
};

/**
 * Update a Scheme
 */
exports.update = function(req, res) {
  var scheme = req.scheme;

  scheme = _.extend(scheme, req.body);

  scheme.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(scheme);
    }
  });
};

/**
 * Delete an Scheme
 */
exports.delete = function(req, res) {
  var scheme = req.scheme;

  scheme.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(scheme);
    }
  });
};

/**
 * List of Schemes
 */
exports.list = function(req, res) {
    GradeScheme.find().sort('-created').populate('user', 'displayName').exec(function(err, schemes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(schemes);
    }
  });
};

/**
 * Get grade scheme in edition
 */
exports.gradeSchemeByEditionID = function(req, res) {
    GradeScheme.findOne({edition:req.edition._id}).sort('-created').populate('user', 'displayName').exec(function(err, scheme) {
    if (err || !scheme) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(scheme);
    }
  });
};


/**
 * Scheme middleware
 */
exports.schemeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Scheme is invalid'
    });
  }

  GradeScheme.findById(id).populate('user', 'displayName').exec(function (err, scheme) {
    if (err) {
      return next(err);
    } else if (!scheme) {
      return res.status(404).send({
        message: 'No Scheme with that identifier has been found'
      });
    }
    req.scheme = scheme;
    next();
  });
};
