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

var whitelistedFields = ['firstName', 'lastName', 'email', 'username', 'position', 'facebook', 'twitter', 'phone', 'profileImageURL', 'banned'];

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
  var multerConfig = config.uploads.profile.image;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  var upload = multer(multerConfig).single('newProfilePicture');

  if (user) {
    existingImageUrl = config.uploads.profile.image.dest + path.basename(user.profileImageURL);
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
      user.profileImageURL = config.uploads.profile.image.urlPaath + req.file.filename;
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
      position: req.user.position,
      facebook: req.user.facebook,
      twitter: req.user.twitter,
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.json(safeUserObject || null);
};
