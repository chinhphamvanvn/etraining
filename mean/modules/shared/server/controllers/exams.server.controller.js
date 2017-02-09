'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Exam = mongoose.model('Exam'),
  fs = require('fs'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Exam
 */
exports.create = function(req, res) {
  var exam = new Exam(req.body);
  exam.user = req.user;

  exam.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(exam);
    }
  });
};

/**
 * Show the current Exam
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var exam = req.exam ? req.exam.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  exam.isCurrentUserOwner = req.user && exam.user && exam.user._id.toString() === req.user._id.toString();

  res.jsonp(exam);
};

/**
 * Update a Exam
 */
exports.update = function(req, res) {
  var exam = req.exam;

  exam = _.extend(exam, req.body);

  exam.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(exam);
    }
  });
};

/**
 * Delete an Exam
 */
exports.delete = function(req, res) {
  var exam = req.exam;

  exam.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(exam);
    }
  });
};

/**
 * List of Exams
 */
exports.list = function(req, res) {
  Exam.find().sort('-created').populate('user', 'displayName').exec(function(err, exams) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(exams);
    }
  });
};



exports.listPublished = function(req, res) {
    Exam.find({published:true}).sort('-created').populate('user', 'displayName').exec(function(err, exams) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(exams);
      }
    });
  };

/**
 * Exam middleware
 */
exports.examByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Exam is invalid'
    });
  }

  Exam.findById(id).populate('user', 'displayName').populate('questions').exec(function (err, exam) {
    if (err) {
      return next(err);
    } else if (!exam) {
      return res.status(404).send({
        message: 'No Exam with that identifier has been found'
      });
    }
    req.exam = exam;
    next();
  });
};



/**
 * Update exam logo
 */
exports.changeExamLogo = function (req, res) {
  var exam = req.exam;
  var existingImageUrl;
  // Filtering to upload only images
  var multerConfig = config.uploads.exam.image;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  var upload = multer(multerConfig).single('newExamLogo');

  if (exam) {
    existingImageUrl = exam.logoURL;
    uploadImage()
      .then(updateExam)
      .then(deleteOldImage)
      .then(function () {
        res.json(exam);
      })
      .catch(function (err) {
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'Course not exist'
    });
  }

  function uploadImage () {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }

  function updateExam() {
    return new Promise(function (resolve, reject) {
      exam.logoURL = config.uploads.exam.image.urlPaath + req.file.filename;
      exam.save(function (err, exam) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  function deleteOldImage () {
    return new Promise(function (resolve, reject) {
      if (existingImageUrl !== Exam.schema.path('logoURL').defaultValue) {
        fs.unlink(existingImageUrl, function (unlinkError) {
          if (unlinkError) {
            console.log(unlinkError);
            resolve();
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
};