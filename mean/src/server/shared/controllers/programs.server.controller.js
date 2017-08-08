'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  CourseProgram = mongoose.model('CourseProgram'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Program
 */
exports.create = function(req, res) {
  var program = new CourseProgram(req.body);
  program.user = req.user;

  program.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(program);
    }
  });
};

/**
 * Show the current Program
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var program = req.program ? req.program.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  program.isCurrentUserOwner = req.user && program.user && program.user._id.toString() === req.user._id.toString();

  res.jsonp(program);
};

/**
 * Update a Program
 */
exports.update = function(req, res) {
  var program = req.program;

  program = _.extend(program, req.body);

  program.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(program);
    }
  });
};

/**
 * Delete an Program
 */
exports.delete = function(req, res) {
  var program = req.program;

  program.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(program);
    }
  });
};

/**
 * List of Programs
 */
exports.list = function(req, res) {
  CourseProgram.find().sort('-created').populate('user', 'displayName').exec(function(err, programs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(programs);
    }
  });
};

exports.listPublic = function(req, res) {
  CourseProgram.find({
    status: 'available',
    enrollStatus: true,
    displayMode: 'open'
  }).sort('-created').populate('user', 'displayName').populate('courses').populate('competencies').exec(function(err, programs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(programs);
    }
  });
};

exports.listPrivate = function(req, res) {
  CourseProgram.find({
    status: 'available',
    enrollStatus: true,
    displayMode: 'enroll'
  }).sort('-created').populate('user', 'displayName').populate('courses').populate('competencies').exec(function(err, programs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(programs);
    }
  });
};

exports.listRestricted = function(req, res) {
  CourseProgram.find({
    status: 'available',
    enrollStatus: true,
    displayMode: 'login'
  }).sort('-created').populate('user', 'displayName').populate('courses').populate('competencies').exec(function(err, programs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(programs);
    }
  });
};

/**
 * Program middleware
 */
exports.programByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Program is invalid'
    });
  }

  CourseProgram.findById(id).populate('user', 'displayName').populate('courses').populate('competencies').populate('organization').exec(function(err, program) {
    if (err) {
      return next(err);
    } else if (!program) {
      return res.status(404).send({
        message: 'No Program with that identifier has been found'
      });
    }
    req.program = program;
    next();
  });
};

exports.listByGroupId = function(req, res) {
  CourseProgram.find({
    organization: req.params.groupId
  }).sort('-created').populate('user', 'displayName').populate('courses').populate('competencies').exec(function(err, programs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(programs);
    }
  });
};
