'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  _ = require('underscore'),
  CourseMember = mongoose.model('CourseMember'),
  Course = mongoose.model('Course'),
  User = mongoose.model('User'),
  CompetencyAchievement = mongoose.model('CompetencyAchievement'),
  Certificate = mongoose.model('Certificate'),
  Competency = mongoose.model('Competency'),
  Setting = mongoose.model('Setting'),
  Message = mongoose.model('Message'),
  config = require(path.resolve('./config/config')),
  nodemailer = require('nodemailer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var smtpTransport = nodemailer.createTransport(config.mailer.options);
/**
 * Create a Member
 */
exports.create = function(req, res) {
  var member = new CourseMember(req.body);
  member.user = req.user;
  if (member.role === 'student')
    getCourse()
      .then(checkCoursePrequisite, function(err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      })
      .then(checkClassroom, function(err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      })
      .then(verifyNotExistMember, function(err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
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
                CourseMember.findOne(member).populate('member').exec(function(err, item) {
                  res.json(item);
                });
                alertTeacher(member, course);
                sendMailToStudent(member, course);
              }
            });
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
  if (member.role === 'teacher') {
    member.save(function(err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        CourseMember.findOne(member).populate('member').exec(function(err, item) {
          res.json(item);
        });
      }
    });
  }

  function alertTeacher(student, course) {
    User.findById(student.member).exec(function(err, studentUser) {
      Setting.findOne({
        code: 'ALERT_MEMBER_ENROLL'
      }).exec(function(err, setting) {
        if (!err && setting && setting.valueBoolean) {
          CourseMember.find({
            role: 'teacher',
            course: course._id,
            status: 'active'
          }).exec(function(err, teachers) {
            _.each(teachers, function(teacher) {
              var alert = new Message({
                title: 'Course activity',
                content: 'User ' + studentUser.displayName + ' has enrolled course ' + course.name,
                level: 'success',
                type: 'alert',
                recipient: teacher.member
              });
              alert.save();
            });
          });
        }
      });
    });
  }

  function sendMailToStudent(student, course) {
    var httpTransport = 'http://';
    if (config.secure && config.secure.ssl === true) {
      httpTransport = 'https://';
    }
    var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
    User.findById(student.member).exec(function(err, studentUser) {
      res.render(path.resolve('modules/shared/server/templates/course-registeration-welcome-email'), {
        name: studentUser.displayName,
        courseName: course.name,
        appName: config.app.title
      }, function(err, emailHTML) {
        var mailOptions = {
          to: studentUser.email,
          from: config.mailer.from,
          subject: 'e-Training Course Notification',
          html: emailHTML
        };
        smtpTransport.sendMail(mailOptions);
      });
    });

  }

  function getCourse() {
    return new Promise(function(resolve, reject) {
      Course.findById(member.course).exec(function(err, course) {
        if (err)
          reject({
            message: 'Course not found'
          });
        else
          resolve(course);
      });
    });
  }

  function verifyNotExistMember(course) {
    return new Promise(function(resolve, reject) {
      CourseMember.findOne({
        status: 'active',
        member: member.member,
        course: course._id
      }).exec(function(err, existMember) {
        if (err || existMember)
          reject({
            message: 'Member already exist'
          });
        else
          resolve(course);
      });
    });
  }

  function checkCoursePrequisite(course) {
    return new Promise(function(resolve, reject) {
      CourseMember.find({
        member: member.member,
        enrollmentStatus: 'completed'
      }).select('course -_id').exec(function(err, completeCourses) {
        var diff = _.difference(course.prequisites, completeCourses);
        if (diff.length > 0) {
          reject({
            message: 'Course prequisite not satisfied'
          });
        } else {
          resolve(course);
        }
      });
    });
  }

  function checkClassroom(course) {
    return new Promise(function(resolve, reject) {
      if (course.model === 'group' && !member.classroom)
        reject({
          message: 'No classroom found'
        });
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

exports.withdraw = function(req, res) {
  var member = req.member;
  member = _.extend(member, req.body);
  member.status = 'withdrawn';
  member.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(member);
      alertTeacher(member);
    }
  });

  function alertTeacher(student) {
    User.findById(student.member).exec(function(err, studentUser) {
      Course.findById(student.course).exec(function(err, course) {
        Setting.findOne({
          code: 'ALERT_MEMBER_WIDTHDRAW'
        }).exec(function(err, setting) {
          if (!err && setting && setting.valueBoolean) {
            CourseMember.find({
              role: 'teacher',
              course: course._id,
              status: 'active'
            }).exec(function(err, teachers) {
              _.each(teachers, function(teacher) {
                var alert = new Message({
                  title: 'Course activity',
                  content: 'User ' + studentUser.displayName + ' has withdrawn course ' + course.name,
                  level: 'warning',
                  type: 'alert',
                  recipient: teacher.member
                });
                alert.save();
              });
            });
          }
        });
      });
    });
  }
};


exports.complete = function(req, res) {
  var member = req.member;
  member = _.extend(member, req.body);
  member.enrollmentStatus = 'completed';
  member.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(member);
      sendMailToStudent(member);
      bindCompetency(member);
    }
  });


  function bindCompetency(student) {
    User.findById(student.member).exec(function(err, studentUser) {
      Course.findById(student.course).exec(function(err, course) {
        _.each(course.competencies, function(competency) {
          var achievement = new CompetencyAchievement();
          achievement.achiever = student.member._id;
          achievement.competency = competency;
          achievement.source = 'course';
          achievement.issueBy = new Date();
          achievement.granter = req.body.teacherId;
          achievement.save();
        });
      });
    });
  }

  function sendMailToStudent(student) {
    var httpTransport = 'http://';
    if (config.secure && config.secure.ssl === true) {
      httpTransport = 'https://';
    }
    var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
    User.findById(student.member).exec(function(err, studentUser) {
      Course.findById(student.course).exec(function(err, course) {
        res.render(path.resolve('modules/shared/server/templates/course-completion-email'), {
          name: studentUser.displayName,
          courseName: course.name,
          appName: config.app.title
        }, function(err, emailHTML) {
          var mailOptions = {
            to: studentUser.email,
            from: config.mailer.from,
            subject: 'e-Training Course Notification',
            html: emailHTML
          };
          smtpTransport.sendMail(mailOptions);
        });
      });
    });

  }
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
  CourseMember.find({
    course: req.course._id
  }).sort('-created').populate('user', 'displayName').populate('member').populate('classroom').exec(function(err, members) {
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
  CourseMember.find({
    classroom: req.classroom._id
  }).sort('-created').populate('user', 'displayName').populate('member').exec(function(err, members) {
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
exports.memberByUser = function(req, res) {
  CourseMember.find({
    status: 'active',
    member: req.params.userId
  }).sort('-created').populate('member').populate('course').populate('classroom').exec(function(err, members) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(members);
    }
  });
};

exports.memberByUserAndCourse = function(req, res) {
  CourseMember.findOne({
    status: 'active',
    member: req.user._id,
    course: req.course._id
  }).sort('-created').populate('member').populate('course').populate('classroom').exec(function(err, member) {
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

  CourseMember.findById(id).populate('user', 'displayName').populate('member').exec(function(err, member) {
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
