'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  CourseEdition = mongoose.model('CourseEdition'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a CourseEdition
 */
exports.create = function(req, res) {
  var edition = new CourseEdition(req.body);
  edition.user = req.user;

  edition.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(edition);
    }
  });
};

/**
 * Show the current CourseEdition
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var edition = req.edition ? req.edition.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  edition.isCurrentUserOwner = req.user && edition.user && edition.user._id.toString() === req.user._id.toString();

  res.jsonp(edition);
};

/**
 * Update a CourseEdition
 */
exports.update = function(req, res) {
  var edition = req.edition;

  edition = _.extend(edition, req.body);

  edition.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(edition);
    }
  });
};

/**
 * Delete an CourseEdition
 */
exports.delete = function(req, res) {
  var edition = req.edition;

  edition.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(edition);
    }
  });
};

/**
 * List of CourseEditions
 */
exports.list = function(req, res) {
  CourseEdition.find().sort('-created').populate('user', 'displayName').exec(function(err, editions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(editions);
    }
  });
};

/**
 * List of Editions in course
 */
exports.editionByCourse = function(req, res) {
  CourseEdition.findOne({
    course: req.course._id
  }).sort('-created').populate('user', 'displayName').exec(function(err, edition) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(edition);
    }
  });
};

/**
 * CourseEdition middleware
 */
exports.editionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'CourseEdition is invalid'
    });
  }

  CourseEdition.findById(id).populate('user', 'displayName').exec(function(err, edition) {
    if (err) {
      return next(err);
    } else if (!edition) {
      return res.status(404).send({
        message: 'No CourseEdition with that identifier has been found'
      });
    }
    req.edition = edition;
    next();
  });
};
