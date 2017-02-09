'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Html = mongoose.model('Html'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Html
 */
exports.create = function(req, res) {
  var html = new Html(req.body);
  html.user = req.user;

  html.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(html);
    }
  });
};

/**
 * Show the current Html
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var html = req.html ? req.html.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  html.isCurrentUserOwner = req.user && html.user && html.user._id.toString() === req.user._id.toString();

  res.jsonp(html);
};

/**
 * Update a Html
 */
exports.update = function(req, res) {
  var html = req.html;

  html = _.extend(html, req.body);

  html.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(html);
    }
  });
};

/**
 * Delete an Html
 */
exports.delete = function(req, res) {
  var html = req.html;

  html.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(html);
    }
  });
};

/**
 * List of Htmls
 */
exports.list = function(req, res) {
  Html.find().sort('-created').populate('user', 'displayName').exec(function(err, htmls) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(htmls);
    }
  });
};

/**
 * Html middleware
 */
exports.htmlByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Html is invalid'
    });
  }

  Html.findById(id).populate('user', 'displayName').exec(function (err, html) {
    if (err) {
      return next(err);
    } else if (!html) {
      return res.status(404).send({
        message: 'No Html with that identifier has been found'
      });
    }
    req.html = html;
    next();
  });
};
