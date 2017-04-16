'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  PermissionObject = mongoose.model('PermissionObject'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Permissionobject
 */
exports.create = function(req, res) {
  var permissionobject = new PermissionObject(req.body);
  permissionobject.user = req.user;

  permissionobject.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(permissionobject);
    }
  });
};

/**
 * Show the current Permissionobject
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var permissionobject = req.permissionobject ? req.permissionobject.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  permissionobject.isCurrentUserOwner = req.user && permissionobject.user && permissionobject.user._id.toString() === req.user._id.toString();

  res.jsonp(permissionobject);
};

/**
 * Update a Permissionobject
 */
exports.update = function(req, res) {
  var permissionobject = req.permissionobject;

  permissionobject = _.extend(permissionobject, req.body);

  permissionobject.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(permissionobject);
    }
  });
};

/**
 * Delete an Permissionobject
 */
exports.delete = function(req, res) {
  var permissionobject = req.permissionobject;

  permissionobject.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(permissionobject);
    }
  });
};

/**
 * List of Permissionobjects
 */
exports.list = function(req, res) {
  PermissionObject.find().sort('-created').populate('user', 'displayName').exec(function(err, permissionobjects) {
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
exports.permissionobjectByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Permissionobject is invalid'
    });
  }

  PermissionObject.findById(id).populate('user', 'displayName').exec(function (err, permissionobject) {
    if (err) {
      return next(err);
    } else if (!permissionobject) {
      return res.status(404).send({
        message: 'No Permissionobject with that identifier has been found'
      });
    }
    req.permissionobject = permissionobject;
    next();
  });
};
