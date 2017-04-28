'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Endpoint = mongoose.model('Endpoint'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Endpoint
 */
exports.create = function(req, res) {
  var endpoint = new Endpoint(req.body);
  endpoint.user = req.user;

  endpoint.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(endpoint);
    }
  });
};

/**
 * Show the current Endpoint
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var endpoint = req.endpoint ? req.endpoint.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  endpoint.isCurrentUserOwner = req.user && endpoint.user && endpoint.user._id.toString() === req.user._id.toString();

  res.jsonp(endpoint);
};

/**
 * Update a Endpoint
 */
exports.update = function(req, res) {
  var endpoint = req.endpoint;

  endpoint = _.extend(endpoint, req.body);

  endpoint.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(endpoint);
    }
  });
};

/**
 * Delete an Endpoint
 */
exports.delete = function(req, res) {
  var endpoint = req.endpoint;

  endpoint.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(endpoint);
    }
  });
};

/**
 * List of Endpoints
 */
exports.list = function(req, res) {
  Endpoint.find().sort('-created').populate('user', 'displayName').exec(function(err, endpoints) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(endpoints);
    }
  });
};

/**
 * Endpoint middleware
 */
exports.endpointByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Endpoint is invalid'
    });
  }

  Endpoint.findById(id).populate('user', 'displayName').exec(function (err, endpoint) {
    if (err) {
      return next(err);
    } else if (!endpoint) {
      return res.status(404).send({
        message: 'No Endpoint with that identifier has been found'
      });
    }
    req.endpoint = endpoint;
    next();
  });
};
