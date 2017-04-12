'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ForumTopic = mongoose.model('ForumTopic'),
  Forum = mongoose.model('Forum'),
  CourseMember = mongoose.model('CourseMember'),
  Course = mongoose.model('Course'),
  CourseEdition = mongoose.model('CourseEdition'),
  User = mongoose.model('User'),
  Setting = mongoose.model('Setting'),
  Message = mongoose.model('Message'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
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
      alertMember();
    }
  });

  function alertMember() {
    Forum.findById(topic.forum).exec(function(err, forum) {
      Course.findById(forum.course).exec(function(err, course) {
        Setting.findOne({
          code: 'ALERT_THREAD_NEW'
        }).exec(function(err, setting) {
          if (!err && setting && setting.valueBoolean) {
            CourseMember.find({
              status: 'active'
            }).exec(function(err, members) {
              _.each(members, function(member) {
                var alert = new Message({
                  title: 'Course activity',
                  content: 'New thread created for course ' + course.name,
                  level: 'primary',
                  type: 'alert',
                  recipient: member.member
                });
                alert.save();
              });
            });
          }
        });
      });
    });
  }
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
  ForumTopic.find().sort('-updated').populate('user', '_id displayName').populate('forum').exec(function(err, topics) {
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
  ForumTopic.find({
    forum: req.forum._id
  }).sort('-updated').populate('user', '_id displayName').populate('forum').exec(function(err, topics) {
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

  ForumTopic.findById(id).populate('user', '_id displayName').populate('forum').exec(function(err, topic) {
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
