'use strict';

/**
 * Module dependencies
 */
var reportsPolicy = require('../policies/reports.server.policy'),
  reports = require('../controllers/reports.server.controller');

module.exports = function(app) {
    app.route('/api/reports/accountStats').all(reportsPolicy.isAllowed)
    .get(reports.accountStats);
    app.route('/api/reports/courseStats').all(reportsPolicy.isAllowed)
    .get(reports.courseStats);
    app.route('/api/reports/userRegistrationStats/:day').all(reportsPolicy.isAllowed)
    .get(reports.userRegistrationStats);
    app.route('/api/reports/userLoginStats/:day').all(reportsPolicy.isAllowed)
    .get(reports.userLoginStats);
    app.route('/api/reports/memberRegistrationStats/:day').all(reportsPolicy.isAllowed)
    .get(reports.memberRegistrationStats);
    app.route('/api/reports/memberInstudyStats/:day').all(reportsPolicy.isAllowed)
    .get(reports.memberInstudyStats);
    app.route('/api/reports/memberCompleteStats/:day').all(reportsPolicy.isAllowed)
    .get(reports.memberCompleteStats);
    app.route('/api/reports/courseAttemptStats/:day/:editionId').all(reportsPolicy.isAllowed)
    .get(reports.courseAttemptStats);
    app.route('/api/reports/memberAttemptStats/:memberId/:editionId').all(reportsPolicy.isAllowed)
    .get(reports.memberAttemptStats);
};
