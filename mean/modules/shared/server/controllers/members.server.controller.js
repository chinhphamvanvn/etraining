'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  _ = require('underscore'),
  CourseMember = mongoose.model('CourseMember'),
  Course = mongoose.model('Course'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Member
 */
exports.create = function(req, res) {
  var member = new CourseMember(req.body);
  member.user = req.user;
  if (member.role=='student')
      getCourse()
      .then(checkCoursePrequisite,function(err) {
           return res.status(422).send({ message: errorHandler.getErrorMessage(err) })
        })
      .then(checkClassroom,function(err) {
           return res.status(422).send({ message: errorHandler.getErrorMessage(err)  })
       })
       .then(verifyNotExistMember,function(err) {
           return res.status(422).send({ message: errorHandler.getErrorMessage(err)  })
       })
      .then(function(course) {
          course.validateEnrollment()           
          .then(function() {
              member.save(function(err) {
                  if (err) {
                      return res.status(422).send({
                        message: errorHandler.getErrorMessage(err)
                      });
                    } else {
                        CourseMember.findOne(member).populate('member').exec(function (err, item) {
                            res.json(item)});
                    }
              });
          }, function(err) {
              return res.status(422).send({
                  message: errorHandler.getErrorMessage(err)
                });
          });
      },function(err) {
          return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
      });
  if (member.role=='teacher') {
      member.save(function(err) {
          if (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
                CourseMember.findOne(member).populate('member').exec(function (err, item) {
                    res.json(item)});
            }
      });
  }
  
  function getCourse() {
      return new Promise(function (resolve, reject) {
          Course.findById(member.course).exec(function (err, course) {
             if (err) 
                 reject({message:'Course not found'});
             else 
                 resolve(course);
          });
      });
    }
  
  function verifyNotExistMember(course) {
      return new Promise(function (resolve, reject) {
          CourseMember.findOne({status:'active',member:member.member,course:course._id}).exec(function (err, existMember) {
             if (err || existMember) 
                 reject({message:'Member already exist'});
             else 
                 resolve(course);
          });
      });
  }
  
  function checkCoursePrequisite(course) {
      return new Promise(function (resolve, reject) {
          CourseMember.find({member:member.member, enrollmentStatus:'completed'}).select('course -_id').exec(function (err, completeCourses) {
             var diff = _.difference(course.prequisites,completeCourses);
             if (diff.length >0) {
                 reject({message:'Course prequisite not satisfied'});
             }
             else {
                 resolve(course);
             }
          });
      });
    }
  
  function checkClassroom (course) {
      return new Promise(function (resolve, reject) {
          if (course.model == 'group' && !member.classroom)
              reject({message:'No classroom found'});
          else
             resolve(course);
      });
    }
};
  
  
  
  

/**
 * Show the current Member
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var member = req.member ? req.member.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  member.isCurrentUserOwner = req.user && member.user && member.user._id.toString() === req.user._id.toString();

  res.jsonp(member);
};

/**
 * Update a Member
 */
exports.update = function(req, res) {
  var member = req.member;

  member = _.extend(member, req.body);

  member.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(member);
    }
  });
};

/**
 * Delete an Member
 */
exports.delete = function(req, res) {
  var member = req.member;

  member.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(member);
    }
  });
};

/**
 * List of Members
 */
exports.list = function(req, res) {
    CourseMember.find().sort('-created').populate('user', 'displayName').exec(function(err, members) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(members);
    }
  });
};

/**
 * List of Members in course
 */
exports.memberByCourse = function(req, res) {
    CourseMember.find({course:req.course._id}).sort('-created').populate('user', 'displayName').populate('member').exec(function(err, members) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(members);
    }
  });
};

/**
 * List of Members in class
 */
exports.memberByClass = function(req, res) {
    CourseMember.find({classroom:req.classroom._id}).sort('-created').populate('user', 'displayName').populate('member').exec(function(err, members) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(members);
    }
  });
};

/**
 * List of Members of current user
 */
exports.me = function(req, res) {
    CourseMember.find({status:'active',member:req.user._id}).sort('-created').populate('member').populate('course').populate('classroom').exec(function(err, members) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(members);
    }
  });
};

exports.meByCourse = function(req, res) {
    CourseMember.findOne({status:'active',member:req.user._id,course:req.course._id}).sort('-created').populate('member').populate('course').populate('classroom').exec(function(err, member) {
    if (err || !member) {
      return res.status(422).send({
        message: 'No member found'
      });
    } else {
      res.jsonp(member);
    }
  });
};

/**
 * Member middleware
 */
exports.memberByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Member is invalid'
    });
  }

  CourseMember.findById(id).populate('user', 'displayName').populate('member').exec(function (err, member) {
    if (err) {
      return next(err);
    } else if (!member) {
      return res.status(404).send({
        message: 'No Member with that identifier has been found'
      });
    }
    req.member = member;
    next();
  });
};
