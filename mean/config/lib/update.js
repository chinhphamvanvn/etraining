'use strict';

/**
 * Module dependencies.
 */

var _ = require('underscore')._;
var cron = require('cron'),
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



module.exports.start = function start() {
    
    CourseAttempt.find().exec(function(err,attempts) {
        _.each(attempts,function(attempt) {
            if (!attempt.course && attempt.edition) {
                CourseEdition.findById(attempt.edition).exec(function(err,edition) {
                    attempt.course = edition.course;
                    attempt.save();
                })
            }
        })
    });
    
    CourseMember.find().exec(function(err,members) {
        _.each(members,function(member) {
            if (!member.edition && member.course) {
                console.log(member);
                CourseEdition.findOne({course:member.course}).exec(function(err,edition) {
                    member.edition = edition._id;
                    member.save();
                })
            }
        })
    });
  
    Course.find().exec(function(err,courses) {
        _.each(courses,function(course) {
                CourseEdition.findOne({course:course._id}).exec(function(err,edition) {
                    course.primaryEdition = edition._id;
                    course.save();
                })
        })
    });



};
