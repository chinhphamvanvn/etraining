'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ExamCandidate = mongoose.model('ExamCandidate'),
  User = mongoose.model('User'),
  Message = mongoose.model('Message'),
  Schedule = mongoose.model('Schedule'),
  CompetencyAchievement = mongoose.model('CompetencyAchievement'),
  Setting = mongoose.model('Setting'),
  config = require(path.resolve('./config/config')),
  nodemailer = require('nodemailer'),
  errorHandler = require(path.resolve('./src/server/core/controllers/errors.server.controller')),
  _ = require('lodash');

var smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Create a Candidate
 */

exports.create = function(req, res) {
  var candidate = new ExamCandidate(req.body);
  candidate.user = req.user;
  if (candidate.role === 'student')
    getSchedule()
      .then(verifyNotExistMember, function(err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      })
      .then(function(schedule) {
        candidate.save(function(err) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            ExamCandidate.findOne(candidate).populate('candidate').exec(function(err, item) {
              alertCandidate(candidate, schedule);
              sendMailToStudent(candidate, schedule);
              res.json(item);
            });

          }
        }, function(err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        });
      }, function(err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      });
  if (candidate.role === 'teacher') {
    candidate.save(function(err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        ExamCandidate.findOne(candidate).populate('candidate').exec(function(err, item) {
          res.json(item);
        });
        getSchedule()
        .then(function(schedule) {
          alertInstructor(candidate, schedule);
        });
      }
    });
  }

  function alertInstructor(instructor, schedule) {
    User.findById(instructor.candidate).exec(function(err, instructorUser) {
      Setting.findOne({
        code: 'ALERT_CANDIDATE_ENROLL'
      }).exec(function(err, setting) {
        if (!err && setting && setting.valueBoolean) {
          var alert = new Message({
            title: 'Exam activity',
            content: 'You are assgined as instructor of exam' + schedule.name,
            level: 'success',
            type: 'alert',
            recipient: instructorUser._id
          });
          alert.save();
        }
      });
    });
  }

  function alertCandidate(candidate, schedule) {
    User.findById(candidate.candidate).exec(function(err, candidateUser) {
      Setting.findOne({
        code: 'ALERT_CANDIDATE_ENROLL'
      }).exec(function(err, setting) {
        if (!err && setting && setting.valueBoolean) {
          var alert = new Message({
            title: 'Exam activity',
            content: 'You are registered for exam' + schedule.name,
            level: 'success',
            type: 'alert',
            recipient: candidateUser._id
          });
          alert.save();
        }
      });
    });
  }

  function getSchedule() {
    return new Promise(function(resolve, reject) {
      Schedule.findById(candidate.schedule).exec(function(err, schedule) {
        if (err)
          reject({
            message: 'Schedule not found'
          });
        else
          resolve(schedule);
      });
    });
  }

  function verifyNotExistMember(schedule) {
    return new Promise(function(resolve, reject) {
      ExamCandidate.findOne({
        status: 'active',
        candidate: candidate.candidate,
        schedule: schedule._id
      }).exec(function(err, existMember) {
        if (err || existMember)
          reject({
            message: 'Member already exist'
          });
        else
          resolve(schedule);
      });
    });
  }

  function sendMailToStudent(student, schedule) {
    var httpTransport = 'http://';
    if (config.secure && config.secure.ssl === true) {
      httpTransport = 'https://';
    }
    var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
    User.findById(student.candidate).exec(function(err, studentUser) {
      res.render(path.resolve('src/server/shared/templates/exam-registeration-welcome-email'), {
        name: studentUser.displayName,
        examName: schedule.name,
        appName: config.app.title
      }, function(err, emailHTML) {
        var mailOptions = {
          to: studentUser.email,
          from: config.mailer.from,
          subject: 'e-Training Exam Notification',
          html: emailHTML
        };
        smtpTransport.sendMail(mailOptions);
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

exports.certify = function(req, res) {
  var instructor = req.candidate;
  ExamCandidate.findById(req.params.studentId).exec(function(err, candidate) {
    Schedule.findById(candidate.schedule).exec(function(err, schedule) {
      _.each(schedule.competencies, function(competency) {
        var achievement = new CompetencyAchievement();
        achievement.achiever = candidate.candidate;
        achievement.competency = competency;
        achievement.source = 'exam';
        achievement.issueBy = new Date();
        achievement.granter = instructor.candidate;
      });
      res.jsonp(candidate);
    });
  });

};

exports.candidateByUserAndSchedule = function(req, res) {
  ExamCandidate.findOne({
    candidate: req.params.userId,
    schedule: req.schedule._id
  }).sort('-created').populate('candidate').populate('schedule').populate('exam').exec(function(err, candidate) {
    if (err || !candidate) {
      return res.status(422).send({
        message: 'No candidate found'
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
  ExamCandidate.find().sort('-created').populate('user', 'displayName').populate('candidate').populate('schedule').populate('exam').exec(function(err, candidates) {
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
  ExamCandidate.find({
    exam: req.exam._id
  }).sort('-created').populate('user', 'displayName').populate('candidate').populate('schedule').populate('exam').exec(function(err, candidates) {
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
  ExamCandidate.find({
    status: 'active',
    candidate: req.params.userId
  }).sort('-created').populate('candidate').populate('exam').populate('schedule').exec(function(err, candidates) {
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

  ExamCandidate.findById(id).populate('user', 'displayName').populate('candidate').populate('schedule').populate('exam').exec(function(err, candidate) {
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
