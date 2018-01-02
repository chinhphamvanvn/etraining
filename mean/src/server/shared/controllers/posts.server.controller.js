'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ForumPost = mongoose.model('ForumPost'),
  ForumTopic = mongoose.model('ForumTopic'),
  CourseMember = mongoose.model('CourseMember'),
  Course = mongoose.model('Course'),
  User = mongoose.model('User'),
  Setting = mongoose.model('Setting'),
  Message = mongoose.model('Message'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Post
 */
exports.create = function(req, res) {
  var post = new ForumPost(req.body);
  post.user = req.user;

  post.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      ForumTopic.findById(post.topic).exec(function(err, topic) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          topic.updated = new Date();
          topic.save();
          res.jsonp(post);
        }
      });
    }
  });
};

/**
 * Show the current Post
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var post = req.post ? req.post.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  post.isCurrentUserOwner = req.user && post.user && post.user._id.toString() === req.user._id.toString();

  res.jsonp(post);
};

/**
 * Update a Post
 */
exports.update = function(req, res) {
  var post = req.post;

  post = _.extend(post, req.body);
  post.updated = new Date();
  post.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      ForumTopic.findById(post.topic).exec(function(err, topic) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          topic.updated = new Date();
          topic.save();
          res.jsonp(post);
        }
      });
    }
  });
};

/**
 * Delete an Post
 */
exports.delete = function(req, res) {
  var post = req.post;

  post.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(post);
    }
  });
};

/**
 * List of ForumPosts
 */
exports.list = function(req, res) {
  ForumPost.find().sort('-created').populate('user', '_id displayName').populate('topic').populate('parent').exec(function(err, posts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(posts);
    }
  });
};

exports.listByTopic = function(req, res) {
  ForumPost.find({
    topic: req.topic._id
  }).sort('-created').populate('user', '_id displayName').populate('topic').populate('parent').exec(function(err, posts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(posts);
    }
  });
};

/**
 * Post middleware
 */
exports.postByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Post is invalid'
    });
  }

  ForumPost.findById(id).populate('user', '_id displayName').populate('topic').populate('parent').exec(function(err, post) {
    if (err) {
      return next(err);
    } else if (!post) {
      return res.status(404).send({
        message: 'No Post with that identifier has been found'
      });
    }
    req.post = post;
    next();
  });
};
