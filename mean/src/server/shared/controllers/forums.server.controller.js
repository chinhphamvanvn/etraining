'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Forum = mongoose.model('Forum'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Forum
 */
exports.create = function(req, res) {
  var forum = new Forum(req.body);
  forum.user = req.user;

  forum.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(forum);
    }
  });
};

/**
 * Show the current Forum
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var forum = req.forum ? req.forum.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  forum.isCurrentUserOwner = req.user && forum.user && forum.user._id.toString() === req.user._id.toString();

  res.jsonp(forum);
};

/**
 * Update a Forum
 */
exports.update = function(req, res) {
  var forum = req.forum;

  forum = _.extend(forum, req.body);

  forum.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(forum);
    }
  });
};

/**
 * Delete an Forum
 */
exports.delete = function(req, res) {
  var forum = req.forum;

  forum.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(forum);
    }
  });
};

/**
 * List of Forums
 */
exports.list = function(req, res) {
  Forum.find().sort('-created').populate('user', 'displayName').exec(function(err, forums) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(forums);
    }
  });
};

exports.forumByCourseID = function(req, res, next) {


  Forum.findOne({
    course: req.course._id
  }).populate('user', 'displayName').exec(function(err, forum) {
    if (err) {
      return next(err);
    } else if (!forum) {
      return res.status(422).send({
        message: 'No Forum with that identifier has been found'
      });
    }
    res.jsonp(forum);
  });
};

/**
 * Forum middleware
 */
exports.forumByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Forum is invalid'
    });
  }

  Forum.findById(id).populate('user', 'displayName').exec(function(err, forum) {
    if (err) {
      return next(err);
    } else if (!forum) {
      return res.status(404).send({
        message: 'No Forum with that identifier has been found'
      });
    }
    req.forum = forum;
    next();
  });
};
