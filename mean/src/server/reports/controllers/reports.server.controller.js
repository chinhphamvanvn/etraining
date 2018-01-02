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
  User = mongoose.model('User'),
  Course = mongoose.model('Course'),
  CourseAttempt = mongoose.model('CourseAttempt'),
  CourseMember = mongoose.model('CourseMember'),
  Stat = mongoose.model('Stat'),
  config = require(path.resolve('./config/config'));


exports.accountStats = function(req, res) {
  // convert mongoose document to JSON
  User.find().exec(function(err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var stats = {};
      stats.total = users.length;
      stats.userAccount = _.filter(users, function(user) {
        return _.includes(user.roles, 'user');
      }).length;
      stats.adminAccount = _.filter(users, function(user) {
        return _.includes(user.roles, 'admin');
      }).length;
      stats.banAccount = _.filter(users, function(user) {
        return user.banned;
      }).length;
      res.jsonp(stats);
    }
  });
};


exports.courseStats = function(req, res) {
  // convert mongoose document to JSON
  Course.find().exec(function(err, courses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var stats = {};
      stats.total = courses.length;
      stats.publishCount = _.filter(courses, function(course) {
        return course.status === 'available';
      }).length;
      CourseMember.find({
        status: 'active'
      }).exec(function(err, members) {
        if (err)
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        else {
          stats.memberCount = _.filter(members, function(member) {
            return member.role === 'student';
          }).length;
          stats.teacherCount = _.filter(members, function(member) {
            return member.role === 'teacher';
          }).length;
          res.jsonp(stats);
        }
      });
    }
  });
};

exports.userRegistrationStats = function(req, res) {
  var day = parseInt(req.params.day, 10);
  Stat.find({
    category: 'USER_REGISTER',
    created: {
      $gt: new Date(Date.now() - day * 24 * 60 * 60 * 1000)
    }
  }).sort('created').exec(function(err, stats) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stats);
    }
  });
};

exports.userLoginStats = function(req, res) {
  var day = parseInt(req.params.day, 10);
  Stat.find({
    category: 'USER_LOGIN',
    created: {
      $gt: new Date(Date.now() - day * 24 * 60 * 60 * 1000)
    }
  }).sort('created').exec(function(err, stats) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stats);
    }
  });
};

exports.courseAttemptStats = function(req, res) {
  var day = parseInt(req.params.day, 10);
  var now = new Date();

  CourseAttempt.aggregate([
    {
      '$match': {
        edition: req.edition._id,
        created: {
          $gt: new Date(Date.now() - day * 24 * 60 * 60 * 1000)
        }
      }
    },
    {
      '$group': {
        '_id': {
          'year': {
            '$year': '$created'
          },
          'month': {
            '$month': '$created'
          },
          'day': {
            '$dayOfMonth': '$created'
          }
        },
        'count': {
          '$sum': 1
        }
      }
    }],
    function(err, docs) {
      if (err)
        console.log(err);
      console.log(docs);
      res.json(docs);
    });
};


exports.memberAttemptStats = function(req, res) {
  var now = new Date();

  CourseAttempt.aggregate([
    {
      '$match': {
        edition: req.edition._id,
        member: req.member._id
      }
    },
    {
      '$group': {
        '_id': {
          'year': {
            '$year': '$created'
          },
          'month': {
            '$month': '$created'
          },
          'day': {
            '$dayOfMonth': '$created'
          }
        },
        'count': {
          '$sum': 1
        }
      }
    }],
    function(err, docs) {
      if (err)
        console.log(err);
      console.log(docs);
      res.json(docs);
    });
};


exports.memberRegistrationStats = function(req, res) {
  var day = parseInt(req.params.day, 10);
  Stat.find({
    category: 'MEMBER_REGISTER',
    created: {
      $gt: new Date(Date.now() - day * 24 * 60 * 60 * 1000)
    }
  }).sort('created').exec(function(err, stats) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stats);
    }
  });
};

exports.memberInstudyStats = function(req, res) {
  var day = parseInt(req.params.day, 10);
  Stat.find({
    category: 'MEMBER_INSTUDY',
    created: {
      $gt: new Date(Date.now() - day * 24 * 60 * 60 * 1000)
    }
  }).sort('created').exec(function(err, stats) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stats);
    }
  });
};

exports.memberCompleteStats = function(req, res) {
  var day = parseInt(req.params.day, 10);
  Stat.find({
    category: 'MEMBER_COMPLETE',
    created: {
      $gt: new Date(Date.now() - day * 24 * 60 * 60 * 1000)
    }
  }).sort('created').exec(function(err, stats) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stats);
    }
  });
};
