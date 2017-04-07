'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  EditionSection = mongoose.model('EditionSection'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Section
 */
exports.create = function(req, res) {
  var section = new EditionSection(req.body);
  section.user = req.user;

  section.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(section);
    }
  });
};

/**
 * Show the current Section
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var section = req.section ? req.section.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  section.isCurrentUserOwner = req.user && section.user && section.user._id.toString() === req.user._id.toString();

  res.jsonp(section);
};

/**
 * Update a Section
 */
exports.update = function(req, res) {
  var section = req.section;

  section = _.extend(section, req.body);

  section.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(section);
    }
  });
};

/**
 * Delete an Section
 */
exports.delete = function(req, res) {
  var section = req.section;

  section.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(section);
    }
  });
};

/**
 * List of Sections
 */
exports.list = function(req, res) {
  EditionSection.find().sort('-created').populate('user', 'displayName').exec(function(err, sections) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sections);
    }
  });
};

/**
 * List of sections in editions
 */
exports.sectionByEditionID = function(req, res) {
  EditionSection.find({
    edition: req.edition._id
  }).sort('-created').populate('user', 'displayName').exec(function(err, sections) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sections);
    }
  });
};

exports.listSurveyByEditionID = function(req, res) {
  EditionSection.find({
    edition: req.edition._id,
    hasContent: true,
    contentType: 'survey',
    survey: {
      $ne: null
    }
  }).sort('-created').populate('user', 'displayName').populate('survey').exec(function(err, sections) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sections);
    }
  });
};

/**
 * Section middleware
 */
exports.sectionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Section is invalid'
    });
  }

  EditionSection.findById(id).populate('user', 'displayName').exec(function(err, section) {
    if (err) {
      return next(err);
    } else if (!section) {
      return res.status(404).send({
        message: 'No Section with that identifier has been found'
      });
    }
    req.section = section;
    next();
  });
};
