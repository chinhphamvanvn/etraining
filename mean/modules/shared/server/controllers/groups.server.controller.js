'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  async = require('async'),
  mongoose = require('mongoose'),
  Group = mongoose.model('Group'),
  Course = mongoose.model('Course'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Group
 */
exports.create = function (req, res) {
  var group = new Group(req.body);
  group.user = req.user;

  group.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(group);
    }
  });
};

/**
 * Show the current Group
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var group = req.group ? req.group.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  group.isCurrentUserOwner = req.user && group.user && group.user._id.toString() === req.user._id.toString();

  res.jsonp(group);
};

/**
 * Update a Group
 */
exports.update = function (req, res) {
  var group = req.group;

  group = _.extend(group, req.body);

  group.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(group);
    }
  });
};

/**
 * Delete an Group
 */
exports.delete = function (req, res) {
  var group = req.group;

  group.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(group);
    }
  });
};

/**
 * List of Groups
 */
exports.listOrganizationGroup = function (req, res) {
  Group.find({category: 'organization'}).sort('-created').populate('user', 'displayName').exec(function (err, groups) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(groups);
    }
  });
};

/**
 * List of Groups by search courses
 */
exports.listGroupBySearchCourse = function (req, res) {
  var keyword   = req.query.keyword,
      regex     = new RegExp(keyword, 'i');

  async.waterfall([
    getGroupIdsBySearchCourse,
    getGroupsByIds
  ], function(err, groups) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(groups);
    }
  });

  function getGroupIdsBySearchCourse(callback) {
    Course.find({name: {$regex: regex}}, {group: 1, _id: 0}).exec(function (err, groupIds) {
      if (err) {
        callback(err);
      } else {
        callback(null, groupIds);
      }
    });
  }

  function getGroupsByIds(groupIds, callback) {
    var groupIdsUniq = _.uniq(groupIds);
    groupIdsUniq = groupIdsUniq.map(function(obj) {
        return obj.group;
    });

    Group.find({_id: {$in: groupIdsUniq}}).exec(function(err, groups) {
        if (err) {
          callback(err);
        } else {
          callback(null, groups);
        }
    });
  }

  // Course.find({name: {$regex: regex}}, {group: 1, _id: 0}).exec(function (err, courses) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.jsonp(courses);
  //   }
  // });
};

exports.listCourseGroup = function (req, res) {
  Group.find({category: 'course'}).sort('-created').populate('user', 'displayName').exec(function (err, groups) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(groups);
    }
  });
};

exports.listLibraryGroup = function (req, res) {
  Group.find({category: 'library'}).sort('-created').populate('user', 'displayName').exec(function (err, groups) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(groups);
    }
  });
};

exports.listCompetencyGroup = function (req, res) {
  Group.find({category: 'competency'}).sort('-created').populate('user', 'displayName').exec(function (err, groups) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(groups);
    }
  });
};


/**
 * Group middleware
 */
exports.groupByID = function (req, res, next, id) {
  console.log('middleware group by id');

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Group is invalid'
    });
  }

  Group.findById(id).populate('user', 'displayName').exec(function (err, group) {
    if (err) {
      return next(err);
    } else if (!group) {
      return res.status(404).send({
        message: 'No Group with that identifier has been found'
      });
    }
    req.group = group;
    next();
  });
};
