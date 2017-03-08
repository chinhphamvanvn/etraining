'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  LibraryMedium = mongoose.model('LibraryMedium'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  fs = require('fs'),
  multer = require('multer'),
  config = require(path.resolve('./config/config'));

/**
 * Create a Medium
 */
exports.create = function(req, res) {
  var medium = new LibraryMedium(req.body);
  medium.user = req.user;

  medium.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(medium);
    }
  });
};

/**
 * Show the current Medium
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var medium = req.medium ? req.medium.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  medium.isCurrentUserOwner = req.user && medium.user && medium.user._id.toString() === req.user._id.toString();

  res.jsonp(medium);
};

/**
 * Update a Medium
 */
exports.update = function(req, res) {
  var medium = req.medium;

  medium = _.extend(medium, req.body);

  medium.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(medium);
    }
  });
};

/**
 * Delete an Medium
 */
exports.delete = function(req, res) {
  var medium = req.medium;

  medium.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(medium);
    }
  });
};

/**
 * List of Media
 */
exports.list = function(req, res) {
    LibraryMedium.find().sort('-created').populate('user', 'displayName').exec(function(err, media) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(media);
    }
  });
};

exports.listByGroup = function(req, res) {
    LibraryMedium.find({group:req.group._id}).sort('-created').populate('user', 'displayName').exec(function(err, media) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(media);
    }
  });
};

exports.listByKeyword = function(req, res) {
  var keyword = req.query.keyword,
      regex   = new RegExp(keyword, 'i');

  LibraryMedium.find({name: {$regex: regex}, published: true}).sort('-created').exec(function(err, media) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(media);
    }
  });
};

/**
 * Medium middleware
 */
exports.mediumByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Medium is invalid'
    });
  }

  LibraryMedium.findById(id).populate('user', 'displayName').exec(function (err, medium) {
    if (err) {
      return next(err);
    } else if (!medium) {
      return res.status(404).send({
        message: 'No Medium with that identifier has been found'
      });
    }
    req.medium = medium;
    next();
  });
};


/**
 * Update media logo
 */
exports.chaangeMediaImage = function (req, res) {
  var media = req.medium;
  var existingImageUrl;
  // Filtering to upload only images
  var multerConfig = config.uploads.media.image;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  var upload = multer(multerConfig).single('newMediaImage');

  if (media) {
    existingImageUrl = config.uploads.media.image.dest+ path.basename(media.imageURL);
    uploadImage()
      .then(updateMedia)
      .then(deleteOldImage)
      .then(function () {
        res.json(course);
      })
      .catch(function (err) {
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'Media not exist'
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

  function updateMedia () {
    return new Promise(function (resolve, reject) {
      media.imageURL = config.uploads.media.image.urlPaath + req.file.filename;
      media.save(function (err, course) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  function deleteOldImage () {
      var defaultUrl = config.uploads.media.image.dest + path.basename(LibraryMedium.schema.path('imageURL').defaultValue);
    return new Promise(function (resolve, reject) {
      if (existingImageUrl !== defaultUrl) {
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



exports.uploadMediaContent = function (req, res) {
    // Filtering to upload only images
    var multerConfig = config.uploads.media.content;
    var upload = multer(multerConfig).single('newMediaContent');
      uploadContent()
        .then(function (result) {
          res.json(result);
        })
        .catch(function (err) {
          res.status(422).send(err);
        });

    function uploadContent () {
      return new Promise(function (resolve, reject) {
        upload(req, res, function (uploadError) {
          if (uploadError) {
              console.log(uploadError);
            reject(errorHandler.getErrorMessage(uploadError));
          } else {
              var downloadURL = config.uploads.media.content.urlPaath + req.file.filename;
              var originalname =  req.file.originalname;
              resolve({downloadURL:downloadURL,filename:originalname});
          }
        });
      });
    }

  };

