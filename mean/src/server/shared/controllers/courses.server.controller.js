'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
  _ = require('lodash'),
  fs = require('fs'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  Course = mongoose.model('Course'),
  CourseEdition = mongoose.model('CourseEdition');

/**
 * Create a Course
 */
exports.create = function(req, res) {
  var course = new Course(req.body);
  course.user = req.user;

  course.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var edition = new CourseEdition();
      edition.course = course._id;
      edition.name = 'v1.0';
      edition.primary = true;
      edition.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else
          res.jsonp(course);
      });
    }
  });
};

/**
 * Show the current Course
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var course = req.course ? req.course.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  course.isCurrentUserOwner = req.user && course.user && course.user._id.toString() === req.user._id.toString();

  res.jsonp(course);
};

/**
 * Update a Course
 */
exports.update = function(req, res) {
  var course = req.course;

  course = _.extend(course, req.body);

  course.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(course);
    }
  });
};

/**
 * Delete an Course
 */
exports.delete = function(req, res) {
  var course = req.course;

  course.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(course);
    }
  });
};

/**
 * List of Courses
 */
exports.list = function(req, res) {
  Course.find().sort('-created').populate('user', 'displayName').populate('group').populate('prequisites').populate('competencies').populate('primaryEdition').exec(function(err, courses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(courses);
    }
  });
};

exports.listPublic = function(req, res) {
  Course.find({
    status: 'available',
    enrollStatus: true,
    displayMode: 'open'
  }).sort('-created').populate('user', 'displayName').populate('group').populate('prequisites').populate('competencies').populate('primaryEdition').exec(function(err, courses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(courses);
    }
  });
};

exports.listPrivate = function(req, res) {
  Course.find({
    status: 'available',
    enrollStatus: true,
    displayMode: 'enroll'
  }).sort('-created').populate('user', 'displayName').populate('group').populate('prequisites').populate('competencies').populate('primaryEdition').exec(function(err, courses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(courses);
    }
  });
};

exports.listRestricted = function(req, res) {
  Course.find({
    status: 'available',
    enrollStatus: true,
    displayMode: 'login'
  }).sort('-created').populate('user', 'displayName').populate('group').populate('prequisites').populate('competencies').populate('primaryEdition').exec(function(err, courses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(courses);
    }
  });
};

exports.listByGroup = function(req, res) {
  Course.find({
    group: req.group._id
  }).sort('-created').populate('user', 'displayName').populate('group').populate('prequisites').populate('competencies').populate('primaryEdition').exec(function(err, courses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(courses);
    }
  });
};

/**
 * List of Courses by keyword
 */
exports.listByKeyword = function(req, res) {
  var keyword = req.query.keyword,
    regex = new RegExp(keyword, 'i');

  Course.find({
    name: {
      $regex: regex
    },
    status: 'available'
  }).sort('-created').populate('group').populate('prequisites').populate('competencies').populate('primaryEdition').exec(function(err, courses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(courses);
    }
  });
};

/**
 * Course middleware
 */
exports.courseByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Course is invalid'
    });
  }

  Course.findById(id).populate('user', 'displayName').populate('group').populate('prequisites').populate('competencies').populate('primaryEdition').exec(function(err, course) {
    if (err) {
      return next(err);
    } else if (!course) {
      return res.status(404).send({
        message: 'No Course with that identifier has been found'
      });
    }
    req.course = course;
    next();
  });
};


/**
 * Update course logo
 */
exports.changeCourseLogo = function(req, res) {
  var course = req.course;
  var existingImageUrl;
  // Filtering to upload only images
  var multerConfig = config.uploads.course.image;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  var upload = multer(multerConfig).single('newCourseLogo');
  if (course) {
    existingImageUrl = config.uploads.course.image.dest + path.basename(course.logoURL);
    uploadImage()
      .then(updateCourse)
      .then(deleteOldImage)
      .then(function() {
        res.json(course);
      })
      .catch(function(err) {
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'Course not exist'
    });
  }

  function uploadImage() {
    return new Promise(function(resolve, reject) {
      upload(req, res, function(uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }

  function updateCourse() {
    return new Promise(function(resolve, reject) {
      course.logoURL = config.uploads.course.image.urlPaath + req.file.filename;
      course.save(function(err, course) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  function deleteOldImage() {
    var defaultUrl = config.uploads.course.image.dest + path.basename(Course.schema.path('logoURL').defaultValue);
    return new Promise(function(resolve, reject) {
      if (existingImageUrl !== defaultUrl) {
        fs.unlink(existingImageUrl, function(unlinkError) {
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


exports.uploadCourseVideo = function(req, res) {
  // Filtering to upload only images
  var course = req.course;
  var multerConfig = config.uploads.course.video;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).videoFileFilter;
  var upload = multer(multerConfig).single('newCourseVideo');
  uploadVideo()
    .then(function(videoURL) {
      res.json({
        videoURL: videoURL
      });
    })
    .catch(function(err) {
      res.status(422).send(err);
    });

  function uploadVideo() {
    return new Promise(function(resolve, reject) {
      upload(req, res, function(uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          var videoURL = config.uploads.course.video.urlPath + req.file.filename;
          resolve(videoURL);
        }
      });
    });
  }

};