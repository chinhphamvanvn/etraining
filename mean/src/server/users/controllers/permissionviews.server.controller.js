'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  PermissionView = mongoose.model('PermissionView'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Permissionview
 */
exports.create = function(req, res) {
  var permissionview = new PermissionView(req.body);
  permissionview.user = req.user;

  permissionview.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(permissionview);
    }
  });
};

/**
 * Show the current Permissionview
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var permissionview = req.permissionview ? req.permissionview.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  permissionview.isCurrentUserOwner = req.user && permissionview.user && permissionview.user._id.toString() === req.user._id.toString();

  res.jsonp(permissionview);
};

/**
 * Update a Permissionview
 */
exports.update = function(req, res) {
  var permissionview = req.permissionview;

  permissionview = _.extend(permissionview, req.body);

  permissionview.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(permissionview);
    }
  });
};

/**
 * Delete an Permissionview
 */
exports.delete = function(req, res) {
  var permissionview = req.permissionview;

  permissionview.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(permissionview);
    }
  });
};

/**
 * List of Permissionviews
 */
exports.list = function(req, res) {
  PermissionView.find().sort('-created').populate('user', 'displayName').exec(function(err, permissionviews) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(permissionviews);
    }
  });
};

/**
 * Permissionview middleware
 */
exports.permissionviewByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Permissionview is invalid'
    });
  }

  PermissionView.findById(id).populate('user', 'displayName').exec(function (err, permissionview) {
    if (err) {
      return next(err);
    } else if (!permissionview) {
      return res.status(404).send({
        message: 'No Permissionview with that identifier has been found'
      });
    }
    req.permissionview = permissionview;
    next();
  });
};
