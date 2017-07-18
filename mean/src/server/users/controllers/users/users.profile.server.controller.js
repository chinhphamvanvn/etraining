'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User'),
  UserLog = mongoose.model('UserLog'),
  validator = require('validator');

var whitelistedFields = ['firstName', 'lastName', 'email', 'username', 'position', 'facebook', 'twitter', 'phone', 'profileImageURL', 'banned', "birthday", "gender"];

/**
 * Update user details
 */
exports.update = function(req, res) {
  // Init Variables
  var user = req.user;

  if (user) {
    // Update whitelisted fields only
    user = _.extend(user, _.pick(req.body, whitelistedFields));
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function(err) {
      if (err) {
        UserLog.schema.statics.updateProfile(user, false);
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        UserLog.schema.statics.updateProfile(user, true);
        req.login(user, function(err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function(req, res) {
  var user = req.user;
  var existingImageUrl;
  // Filtering to upload only images
  var multerConfig = config.uploads.user.image;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  var upload = multer(multerConfig).single('newProfilePicture');
  var userDir = config.uploads.user.base + user._id;
  if (!fs.existsSync(userDir)){
    fs.mkdirSync(userDir);
  }
  config.uploads.user.image.urlPath = config.uploads.user.image.urlPath.replace('$USER_ID', user._id);
  config.uploads.user.image.dest = config.uploads.user.image.dest.replace('$USER_ID', user._id);
  if (user) {
    existingImageUrl = config.uploads.user.image.dest.replace('$USER_ID', user._id) + path.basename(user.profileImageURL);
    uploadImage()
      .then(updateUser)
      .then(deleteOldImage)
      .then(login)
      .then(function() {
        UserLog.schema.statics.updateProfileAvatar(user, true);
        res.json(user);
      })
      .catch(function(err) {
        UserLog.schema.statics.updateProfileAvatar(user, false);
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'User is not signed in'
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

  function updateUser() {
    return new Promise(function(resolve, reject) {
      user.profileImageURL = config.uploads.user.image.urlPath + req.file.filename;
      user.save(function(err, theuser) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  function deleteOldImage() {
    return new Promise(function(resolve, reject) {
      if (existingImageUrl !== User.schema.path('profileImageURL').defaultValue) {
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

  function login() {
    return new Promise(function(resolve, reject) {
      req.login(user, function(err) {
        if (err) {
          res.status(400).send(err);
        } else {
          resolve();
        }
      });
    });
  }
};

/**
 * Send User
 */
exports.me = function(req, res) {
  // Sanitize the user - short term solution. Copied from core.server.controller.js
  // TODO create proper passport mock: See https://gist.github.com/mweibel/5219403
  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      _id: req.user._id,
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      phone: req.user.phone,
      group: req.user.group,
      permissionView: req.user.permissionView,
      permissionApi: req.user.permissionApi,
      position: req.user.position,
      facebook: req.user.facebook,
      twitter: req.user.twitter,
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      birthday: req.user.birthday,
      gender: req.user.gender,
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.json(safeUserObject || null);
};


exports.uploadVideo = function(req, res) {
  // Filtering to upload only Video
  var user = req.user;
  var multerConfig = config.uploads.user.video;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).videoFileFilter;
  var upload = multer(multerConfig).single('newVideo');
  var userDir = config.uploads.user.base + user._id;
  if (!fs.existsSync(userDir)){
    fs.mkdirSync(userDir);
  }
  config.uploads.user.video.urlPath = config.uploads.user.video.urlPath.replace('$USER_ID', user._id);
  config.uploads.user.video.dest = config.uploads.user.video.dest.replace('$USER_ID', user._id);
  uploadVideo()
    .then(function(videoUrl) {
      res.json({
        videoUrl: videoUrl
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
          var videoUrl = config.uploads.user.video.urlPath + req.file.filename;
          resolve(videoUrl);
        }
      });
    });
  }

};

exports.uploadAudio = function(req, res) {
  // Filtering to upload only audio
  var user = req.user;
  var multerConfig = config.uploads.user.audio;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).audioFileFilter;
  var upload = multer(multerConfig).single('newAudio');
  var userDir = config.uploads.user.base + user._id;
  if (!fs.existsSync(userDir)){
    fs.mkdirSync(userDir);
  }
  config.uploads.user.audio.urlPath = config.uploads.user.audio.urlPath.replace('$USER_ID', user._id);
  config.uploads.user.audio.dest = config.uploads.user.audio.dest.replace('$USER_ID', user._id);
  uploadAudio()
    .then(function(audioUrl) {
      res.json({
        audioUrl: audioUrl
      });
    })
    .catch(function(err) {
      res.status(422).send(err);
    });

  function uploadAudio() {
    return new Promise(function(resolve, reject) {
      upload(req, res, function(uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          var audioUrl = config.uploads.user.audio.urlPath + req.file.filename;
          resolve(audioUrl);
        }
      });
    });
  }

};

exports.uploadFile = function(req, res) {
  var user = req.user;
  var multerConfig = config.uploads.user.file;
  var upload = multer(multerConfig).single('newFile');
  var userDir = config.uploads.user.base + user._id;
  if (!fs.existsSync(userDir)){
    fs.mkdirSync(userDir);
  }
  config.uploads.user.document.urlPath = config.uploads.user.document.urlPath.replace('$USER_ID', user._id);
  config.uploads.user.document.dest = config.uploads.user.document.dest.replace('$USER_ID', user._id);
  uploadFile()
    .then(function(filrUrl) {
      res.json({
        filrUrl: filrUrl
      });
    })
    .catch(function(err) {
      res.status(422).send(err);
    });

  function uploadFile() {
    return new Promise(function(resolve, reject) {
      upload(req, res, function(uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          var fileURL = config.uploads.user.document.urlPath + req.file.filename;
          resolve(fileURL);
        }
      });
    });
  }

};
