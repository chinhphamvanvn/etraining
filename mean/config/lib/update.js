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
    
};
