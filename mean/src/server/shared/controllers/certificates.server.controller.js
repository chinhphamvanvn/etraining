'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Certificate = mongoose.model('Certificate'),
  CertificateTemplate = mongoose.model('CertificateTemplate'),
  CourseMember = mongoose.model('CourseMember'),
  Course = mongoose.model('Course'),
  User = mongoose.model('User'),
  config = require(path.resolve('./config/config')),
  async = require('async'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
  _ = require('lodash');

var webshot = require('webshot');
var fs = require('fs');

/**
 * Create a Certificate
 */
exports.create = function (req, res) {
  var certificate = new Certificate(req.body);
  certificate.user = req.user;

  certificate.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(certificate);
    }
  });
};

exports.grant = function (req, res, next) {
  var certificate = new Certificate(req.body);
  certificate.user = req.user;
  async.waterfall([
    function (done) {
      User.findById(certificate.authorizer).exec(function (err, teacherUser) {
        if (!err && teacherUser)
          done(err, teacherUser);
      });
    },
    function (teacherUser, done) {
      CourseMember.findById(certificate.member).populate('member').exec(function (err, studentMember) {
        if (!err && studentMember)
          done(err, teacherUser, studentMember);
      });
    },
    function (teacherUser, studentMember, done) {
      Course.findById(studentMember.course).exec(function (err, course) {
        done(err, teacherUser, studentMember, course);
      });
    },
    function (teacherUser, studentMember, course, done) {
      CertificateTemplate.findById(course.certificateTemplate).exec(function (err, certificateTemplate) {
        done(err, teacherUser, studentMember, course, certificateTemplate);
      });

    },
    function (teacherUser, studentMember, course, certificateTemplate, done) {
      var dateFormat = require('dateformat');
      var issueDate = new Date();
      issueDate = dateFormat(issueDate, 'dddd, mmmm dS, yyyy');
      var pathCertificateTemplate = 'src/server/shared/templates/certificate';
      if (certificateTemplate) {
        pathCertificateTemplate = certificateTemplate.pathHtml;
      }
      res.render(pathCertificateTemplate, {
        studentName: studentMember.member.displayName,
        courseName: course.name,
        instructorName: teacherUser.displayName,
        issueDate: issueDate,
        appName: config.app.title
      }, function (err, certificateHTNL) {
        done(err, certificateHTNL);
      });
    },
    function (certificateHTNL, done) {
      certificate.base64data = '';
      var renderStream = webshot(certificateHTNL, {
        siteType: 'html'
      });
      renderStream.on('data', function (data) {
        certificate.base64data += data.toString('base64');
      });
      renderStream.on('end', function () {
        certificate.save(function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.jsonp(certificate);
            done(err);
          }
        });
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};


/**
 * Show the current Certificate
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var certificate = req.certificate ? req.certificate.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the 'owner'.
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  certificate.isCurrentUserOwner = req.user && certificate.user && certificate.user._id.toString() === req.user._id.toString();

  res.jsonp(certificate);
};

/**
 * Update a Certificate
 */
exports.update = function (req, res) {
  var certificate = req.certificate;

  certificate = _.extend(certificate, req.body);

  certificate.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(certificate);
    }
  });
};

/**
 * Delete an Certificate
 */
exports.delete = function (req, res) {
  var certificate = req.certificate;

  certificate.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(certificate);
    }
  });
};

/**
 * List of Certificates
 */
exports.list = function (req, res) {
  Certificate.find().sort('-created').populate('user', 'displayName').populate('course').populate('authorizer').populate('edition').populate('member').exec(function (err, certificates) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(certificates);
    }
  });
};

exports.certificateByMember = function (req, res, next) {

  Certificate.findOne({
    member: req.member._id
  }).populate('user', 'displayName').populate('course').populate('authorizer').populate('edition').populate('member').exec(function (err, certificate) {
    if (err) {
      return next(err);
    } else if (!certificate) {
      return res.status(422).send({
        message: 'No Certificate with that identifier has been found'
      });
    }
    res.jsonp(certificate);
  });
};

/**
 * Certificate middleware
 */
exports.certificateByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Certificate is invalid'
    });
  }

  Certificate.findById(id).populate('user', 'displayName').populate('course').populate('authorizer').populate('edition').populate('member').exec(function (err, certificate) {
    if (err) {
      return next(err);
    } else if (!certificate) {
      return res.status(404).send({
        message: 'No Certificate with that identifier has been found'
      });
    }
    req.certificate = certificate;
    next();
  });
};
