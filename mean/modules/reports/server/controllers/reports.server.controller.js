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
  Stat = mongoose.model('Stat'),
  config = require(path.resolve('./config/config'));


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
          return _.includes(user.roles,'user');
      }).length;
      stats.adminAccount = _.filter(users,function(user) {
          return _.includes(user.roles,'admin');
      }).length;
      stats.banAccount = _.filter(users,function(user) {
          return user.banned;
      }).length;
      res.jsonp(stats);
    }
  })
};

exports.userRegistrationStats = function(req, res) {
    var day = parseInt(req.params.day);
    Stat.find({category:'USER_REGISTER',created:{$gt:new Date(Date.now() - day*24*60 * 1000)}}).sort('created').exec(function(err,stats) {
        if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
              res.jsonp(stats);
          }
    });
}

exports.userLoginStats = function(req, res) {
    var day = parseInt(req.params.day);
    Stat.find({category:'USER_LOGIN',created:{$gt:new Date(Date.now() - day*24*60 * 1000)}}).sort('created').exec(function(err,stats) {
        if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
              res.jsonp(stats);
          }
    });
}