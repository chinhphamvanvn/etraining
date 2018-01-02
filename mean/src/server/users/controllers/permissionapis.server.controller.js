'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  PermissionApi = mongoose.model('PermissionApi'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Permissionobject
 */
exports.create = function(req, res) {
  var permissionapi = new PermissionApi(req.body);
  permissionapi.user = req.user;

  permissionapi.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(permissionapi);
    }
  });
};

/**
 * Show the current Permissionobject
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var permissionapi = req.permissionapi ? req.permissionapi.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  permissionapi.isCurrentUserOwner = req.user && permissionapi.user && permissionapi.user._id.toString() === req.user._id.toString();

  res.jsonp(permissionapi);
};

/**
 * Update a Permissionobject
 */
exports.update = function(req, res) {
  var permissionapi = req.permissionapi;

  permissionapi = _.extend(permissionapi, req.body);

  permissionapi.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(permissionapi);
    }
  });
};

/**
 * Delete an Permissionobject
 */
exports.delete = function(req, res) {
  var permissionapi = req.permissionapi;

  permissionapi.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(permissionapi);
    }
  });
};

/**
 * List of Permissionobjects
 */
exports.list = function(req, res) {
  PermissionApi.find().sort('-created').populate('user', 'displayName').exec(function(err, permissionobjects) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(permissionobjects);
    }
  });
};

/**
 * Permissionobject middleware
 */
exports.permissionapiByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Permissionobject is invalid'
    });
  }

  PermissionApi.findById(id).populate('user', 'displayName').exec(function (err, permissionapi) {
    if (err) {
      return next(err);
    } else if (!permissionapi) {
      return res.status(404).send({
        message: 'No permissionapi with that identifier has been found'
      });
    }
    req.permissionapi = permissionapi;
    next();
  });
};
