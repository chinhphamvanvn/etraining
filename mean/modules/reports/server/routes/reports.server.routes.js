'use strict';

/**
 * Module dependencies
 */
var reportsPolicy = require('../policies/reports.server.policy'),
  reports = require('../controllers/reports.server.controller');

module.exports = function(app) {
    app.route('/api/reports/accountStats').all(reportsPolicy.isAllowed)
    .get(reports.accountStats)
    app.route('/api/reports/userRegistrationStats').all(reportsPolicy.isAllowed)
    .get(reports.userRegistrationStats)
    app.route('/api/reports/userLoginStats').all(reportsPolicy.isAllowed)
    .get(reports.userLoginStats)

};
