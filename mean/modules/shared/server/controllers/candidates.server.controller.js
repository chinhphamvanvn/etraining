'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ExamCandidate = mongoose.model('ExamCandidate'),
  Schedule = mongoose.model('Schedule'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Candidate
 */

exports.create = function(req, res) {
    var candidate = new ExamCandidate(req.body);
    candidate.user = req.user;
    if (candidate.role=='student')
        getSchedule()
         .then(verifyNotExistMember,function(err) {
             return res.status(422).send({ message: errorHandler.getErrorMessage(err)  })
         })
        .then(function(schedule) {
            candidate.save(function(err) {
                    if (err) {
                        return res.status(422).send({
                          message: errorHandler.getErrorMessage(err)
                        });
                      } else {
                          ExamCandidate.findOne(candidate).populate('candidate').exec(function (err, item) {
                              res.json(item);
                           });              
                          alertStudent(candidate,schedule);
                      }
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
    if (candidate.role=='teacher') {
        candidate.save(function(err) {
            if (err) {
                return res.status(422).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                  ExamCandidate.findOne(candidate).populate('candidate').exec(function (err, item) {
                      res.json(item)});
                  alertInstructor(candidate,schedule);
              }
        });
    }
    
    function alertInstructor(instructor,schedule) {
        User.findById(instructor.candidate).exec(function(err,instructorUser) {
            Setting.findOne({code:'ALERT_CANDIDATE_ENROLL'}).exec(function(err,setting) {
                if (!err && setting && setting.valueBoolean)  {
                    var alert = new Message({title:'Exam activity',content:'You are assgined as instructor of exam' + schedule.name,level:'success',type:'alert',recipient: instructorUser._id});
                    alert.save();
                } 
            });
        });
    }
    
    function alertCandidate(candidate,schedule) {
        User.findById(candidate.candidate).exec(function(err,candidateUser) {
            Setting.findOne({code:'ALERT_CANDIDATE_ENROLL'}).exec(function(err,setting) {
                if (!err && setting && setting.valueBoolean)  {
                    var alert = new Message({title:'Exam activity',content:'You are registered for exam' + schedule.name,level:'success',type:'alert',recipient: candidateUser._id});
                    alert.save();
                } 
            });
        });
    }
    
    function getSchedule() {
        return new Promise(function (resolve, reject) {
            Schedule.findById(candidate.schedule).exec(function (err, schedule) {
               if (err) 
                   reject({message:'Schedule not found'});
               else 
                   resolve(schedule);
            });
        });
      }
    
    function verifyNotExistMember(schedule) {
        return new Promise(function (resolve, reject) {
            ExamCandidate.findOne({status:'active',candidate:candidate.candidate,schedule:schedule._id}).exec(function (err, existMember) {
               if (err || existMember) 
                   reject({message:'Member already exist'});
               else 
                   resolve(schedule);
            });
        });
    }
    


  };

/**
 * Show the current Candidate
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var candidate = req.candidate ? req.candidate.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  candidate.isCurrentUserOwner = req.user && candidate.user && candidate.user._id.toString() === req.user._id.toString();

  res.jsonp(candidate);
};

/**
 * Update a Candidate
 */
exports.update = function(req, res) {
  var candidate = req.candidate;

  candidate = _.extend(candidate, req.body);

  candidate.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(candidate);
    }
  });
};

/**
 * Delete an Candidate
 */
exports.delete = function(req, res) {
  var candidate = req.candidate;

  candidate.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(candidate);
    }
  });
};

/**
 * List of ExamCandidates
 */
exports.list = function(req, res) {
  ExamCandidate.find().sort('-created').populate('user', 'displayName').exec(function(err, candidates) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(candidates);
    }
  });
};

exports.listByExam = function(req, res) {
    ExamCandidate.find({exam:req.exam._id}).sort('-created').populate('user', 'displayName').populate('candidate').populate('schedule').populate('exam').exec(function(err, candidates) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(candidates);
      }
    });
  };
  
  exports.candidateByUser = function(req, res) {
      ExamCandidate.find({status:'active',candidate:req.params.userId}).sort('-created').populate('candidate').populate('exam').populate('schedule').exec(function(err, candidates) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(candidates);
      }
    });
  };

/**
 * ExamCandidate middleware
 */
exports.candidateByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'ExamCandidate is invalid'
    });
  }

  ExamCandidate.findById(id).populate('user', 'displayName').populate('candidate').exec(function (err, candidate) {
    if (err) {
      return next(err);
    } else if (!candidate) {
      return res.status(404).send({
        message: 'No Candidate with that identifier has been found'
      });
    }
    req.candidate = candidate;
    next();
  });
};
