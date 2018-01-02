'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Video = mongoose.model('Video'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
  _ = require('lodash'),
  fs = require('fs'),
  multer = require('multer'),
  config = require(path.resolve('./config/config'));

/**
 * Create a Video
 */
exports.create = function(req, res) {
  var video = new Video(req.body);
  video.user = req.user;

  video.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(video);
    }
  });
};

/**
 * Show the current Video
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var video = req.video ? req.video.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  video.isCurrentUserOwner = req.user && video.user && video.user._id.toString() === req.user._id.toString();

  res.jsonp(video);
};

/**
 * Update a Video
 */
exports.update = function(req, res) {
  var video = req.video;

  video = _.extend(video, req.body);

  video.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(video);
    }
  });
};

/**
 * Delete an Video
 */
exports.delete = function(req, res) {
  var video = req.video;

  video.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(video);
    }
  });
};

/**
 * List of Videos
 */
exports.list = function(req, res) {
  Video.find().sort('-created').populate('user', 'displayName').exec(function(err, videos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(videos);
    }
  });
};

/**
 * Video middleware
 */
exports.videoByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Video is invalid'
    });
  }

  Video.findById(id).populate('user', 'displayName').exec(function(err, video) {
    if (err) {
      return next(err);
    } else if (!video) {
      return res.status(404).send({
        message: 'No Video with that identifier has been found'
      });
    }
    req.video = video;
    next();
  });
};


