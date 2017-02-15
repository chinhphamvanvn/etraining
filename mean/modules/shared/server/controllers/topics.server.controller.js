'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ForumTopic = mongoose.model('ForumTopic'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Topic
 */
exports.create = function(req, res) {
  var topic = new ForumTopic(req.body);
  topic.user = req.user;

  topic.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(topic);
    }
  });
};

/**
 * Show the current Topic
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var topic = req.topic ? req.topic.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  topic.isCurrentUserOwner = req.user && topic.user && topic.user._id.toString() === req.user._id.toString();

  res.jsonp(topic);
};

/**
 * Update a Topic
 */
exports.update = function(req, res) {
  var topic = req.topic;

  topic = _.extend(topic, req.body);
  topic.updated = new Date();
  topic.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(topic);
    }
  });
};

/**
 * Delete an Topic
 */
exports.delete = function(req, res) {
  var topic = req.topic;

  topic.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(topic);
    }
  });
};

/**
 * List of ForumTopics
 */
exports.list = function(req, res) {
  ForumTopic.find().sort('-created').populate('user', 'displayName').exec(function(err, topics) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(topics);
    }
  });
};

/**
 * List of ForumTopics
 */
exports.listByForum = function(req, res) {
  ForumTopic.find({forum:req.forum._id}).sort('-created').populate('user', 'displayName').exec(function(err, topics) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(topics);
    }
  });
};

/**
 * Topic middleware
 */
exports.topicByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Topic is invalid'
    });
  }

  ForumTopic.findById(id).populate('user', 'displayName').exec(function (err, topic) {
    if (err) {
      return next(err);
    } else if (!topic) {
      return res.status(404).send({
        message: 'No Topic with that identifier has been found'
      });
    }
    req.topic = topic;
    next();
  });
};
