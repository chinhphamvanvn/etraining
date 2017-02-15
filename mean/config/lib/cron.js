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
    EditionSection = mongoose.model('EditionSection');





module.exports.start = function start() {
    var updateEnrollStatusJob = new cron.CronJob({
            cronTime: '*/5 * * * *',
            onTick: function() {
                var members = [];
                CourseAttempt.find({"created":{$gt:new Date(Date.now() - 10*60 * 1000)}}).populate('member').exec(function(err,attempts)
                {
                    _.each(attempts,function(attempt) {
                        var member = attempt.member;
                        if (!_.contains(members,member._id)) {
                            members.push(member._id);
                            if (member.enrollmentStatus=='registered') {
                                member.enrollmentStatus='in-study';
                                member.save();
                            } else if (member.enrollmentStatus=='in-study') {
                                CourseEdition.findOne({course:member.course}).exec(function(err, edition) {
                                    EditionSection.find({edition:edition._id}).exec(function(err, sections) {
                                        CourseAttempt.find({edition:edition._id,member:member._id}).exec(function(err, attempts) {
                                            var unreadSection = _.find(sections,function(section) {
                                                    var completeAttempt = _.find(attempts,function(att) {
                                                        return att.section == section._id && att.status=='completed';
                                                    });
                                                    if (completeAttempt)
                                                        return false;
                                                    return true;
                                                });
                                            if (!unreadSection) {
                                                member.enrollmentStatus='completed';
                                                member.save();
                                            }
                                        });
                                    });
                                });
                            }
                        }
                    });
                });
            },                
            start: true,
            timezone: 'America/Los_Angeles'
    });

    updateEnrollStatusJob.start();

};
