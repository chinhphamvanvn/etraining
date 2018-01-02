'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  CertificateTemplate = mongoose.model('CertificateTemplate'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Certificatetemplate
 */
exports.create = function(req, res) {
  var certificatetemplate = new CertificateTemplate(req.body);
  certificatetemplate.user = req.user;

  certificatetemplate.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(certificatetemplate);
    }
  });
};

/**
 * Show the current Certificatetemplate
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var certificatetemplate = req.certificatetemplate ? req.certificatetemplate.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  certificatetemplate.isCurrentUserOwner = req.user && certificatetemplate.user && certificatetemplate.user._id.toString() === req.user._id.toString();

  res.jsonp(certificatetemplate);
};

/**
 * Update a Certificatetemplate
 */
exports.update = function(req, res) {
  var certificatetemplate = req.certificatetemplate;

  certificatetemplate = _.extend(certificatetemplate, req.body);

  certificatetemplate.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(certificatetemplate);
    }
  });
};

/**
 * Delete an Certificatetemplate
 */
exports.delete = function(req, res) {
  var certificatetemplate = req.certificatetemplate;

  certificatetemplate.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(certificatetemplate);
    }
  });
};

/**
 * List of Certificatetemplates
 */
exports.list = function(req, res) {
  CertificateTemplate.find().sort('-created').populate('user', 'displayName').exec(function(err, certificatetemplates) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(certificatetemplates);
    }
  });
};

/**
 * Certificatetemplate middleware
 */
exports.certificatetemplateByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Certificatetemplate is invalid'
    });
  }

  CertificateTemplate.findById(id).populate('user', 'displayName').exec(function (err, certificatetemplate) {
    if (err) {
      return next(err);
    } else if (!certificatetemplate) {
      return res.status(404).send({
        message: 'No Certificatetemplate with that identifier has been found'
      });
    }
    req.certificatetemplate = certificatetemplate;
    next();
  });
};
