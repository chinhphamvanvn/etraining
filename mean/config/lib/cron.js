'use strict';

/**
 * Module dependencies.
 */

var _ = require('underscore')._,
  config = require('../config'),
  cron = require('cron'),
  mongoose = require('mongoose'),
  CourseMember = mongoose.model('CourseMember'),
  CourseAttempt = mongoose.model('CourseAttempt'),
  CourseEdition = mongoose.model('CourseEdition'),
  Course = mongoose.model('Course'),
  User = mongoose.model('User'),
  UserLog = mongoose.model('UserLog'),
  Stat = mongoose.model('Stat'),
  Setting = mongoose.model('Setting'),
  Message = mongoose.model('Message'),
  EditionSection = mongoose.model('EditionSection');

function alertTeacherOnComplete(student) {
  User.findById(student.member).exec(function(err, studentUser) {
    Course.findById(student.course).exec(function(err, course) {
      Setting.findOne({
        code: 'ALERT_MEMBER_COMPLETE'
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
                content: 'User ' + studentUser.displayName + ' has withdrawn course' + course.name,
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

function updateCompletedMember() {
  var members = [];
  CourseAttempt.find({
    created: {
      $gt: new Date(Date.now() - 10 * 60 * 1000)
    }
  }).populate('member').exec(function(err, attempts) {
    _.each(attempts, function(attempt) {
      var member = attempt.member;
      if (!_.contains(members, member._id)) {
        members.push(member._id);
        if (member.enrollmentStatus === 'in-study') {
          CourseEdition.findOne({
            course: member.course
          }).exec(function(err, edition) {
            EditionSection.find({
              edition: edition._id
            }).exec(function(err, sections) {
              CourseAttempt.find({
                edition: edition._id,
                member: member._id
              }).exec(function(err, attempts) {
                var unreadSection = _.find(sections, function(section) {
                  var completeAttempt = _.find(attempts, function(att) {
                    return att.section === section._id && att.status === 'completed';
                  });
                  if (completeAttempt)
                    return false;
                  return true;
                });
                if (!unreadSection) {
                  member.enrollmentStatus = 'completed';
                  member.save();
                  alertTeacherOnComplete(member);
                }
              });
            });
          });
        }
      }
    });
  });
}

function updateRegisteredMember() {
  var members = [];
  CourseAttempt.find({
    created: {
      $gt: new Date(Date.now() - 10 * 60 * 1000)
    }
  }).populate('member').exec(function(err, attempts) {
    _.each(attempts, function(attempt) {
      var member = attempt.member;
      if (!_.contains(members, member._id)) {
        members.push(member._id);
        if (member.enrollmentStatus === 'registered') {
          member.enrollmentStatus = 'in-study';
          member.save();
        }
      }
    });
  });
}

function countRegisterAccount() {
  User.count({
    created: {
      $gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  }).exec(function(err, count) {
    var stat = new Stat({
      created: new Date(),
      count: count,
      category: 'USER_REGISTER'
    });
    stat.save();
  });
}

function countLoginAccount() {
  UserLog.count({
    tag: 'LOGIN',
    created: {
      $gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  }).exec(function(err, count) {
    var stat = new Stat({
      created: new Date(),
      count: count,
      category: 'USER_LOGIN'
    });
    stat.save();
  });
}

function countCourseMember() {
  CourseMember.count({
    status: 'active',
    enrollmentStatus: 'registered',
    created: {
      $gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  }).exec(function(err, count) {
    var stat = new Stat({
      created: new Date(),
      count: count,
      category: 'MEMBER_REGISTER'
    });
    stat.save();
  });
  CourseMember.count({
    status: 'active',
    enrollmentStatus: 'instudy',
    created: {
      $gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  }).exec(function(err, count) {
    var stat = new Stat({
      created: new Date(),
      count: count,
      category: 'MEMBER_INSTUDY'
    });
    stat.save();
  });
  CourseMember.count({
    status: 'active',
    enrollmentStatus: 'completed',
    created: {
      $gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  }).exec(function(err, count) {
    var stat = new Stat({
      created: new Date(),
      count: count,
      category: 'MEMBER_COMPLETE'
    });
    stat.save();
  });
}


module.exports.start = function start() {
  var updateCompletedMemberJob = new cron.CronJob({
    cronTime: '*/5 * * * *',
    onTick: updateCompletedMember,
    start: true,
    timezone: 'America/Los_Angeles'
  });

  var updateRegisteredMemberJob = new cron.CronJob({
    cronTime: '*/5 * * * *',
    onTick: updateRegisteredMember,
    start: true,
    timezone: 'America/Los_Angeles'
  });

  var countRegisterAccountJob = new cron.CronJob({
    cronTime: '0 55 23 * * *',
    onTick: countRegisterAccount,
    start: true,
    timezone: 'America/Los_Angeles'
  });

  var countLoginAccountJob = new cron.CronJob({
    cronTime: '0 55 23 * * *',
    onTick: countLoginAccount,
    start: true,
    timezone: 'America/Los_Angeles'
  });

  var countCourseMemberJob = new cron.CronJob({
    cronTime: '0 55 23 * * *',
    onTick: countCourseMember,
    start: true,
    timezone: 'America/Los_Angeles'
  });

  updateRegisteredMemberJob.start();
  updateRegisteredMemberJob.start();
  countRegisterAccountJob.start();
  countLoginAccountJob.start();
  countCourseMemberJob.start();

};
