'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  fs = require('fs'),
  multer = require('multer'),
  User = mongoose.model('User'),
  config = require(path.resolve('./config/config'));



/**
 * Show the current Video
 */
exports.accountStats = function(req, res) {
  // convert mongoose document to JSON
  User.find().exec(function(err,users) {
      if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var stats = {};
      stats.total = users.length;
      stats.userAccount = _.filter(users,function(user) {
          return _.contains(user.roles,'user');
      }).length;
      stats.adminAccount = _.filter(users,function(user) {
          return _.contains(user.roles,'admin');
      }).length;
      stats.banAccount = _.filter(users,function(user) {
          return user.banned;
      }).length;
      res.jsonp(stats);
    }
  })
};
