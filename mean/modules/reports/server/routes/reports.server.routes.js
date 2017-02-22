'use strict';

/**
 * Module dependencies
 */
var reportsPolicy = require('../policies/reports.server.policy'),
  reports = require('../controllers/reports.server.controller');

module.exports = function(app) {
    app.route('/api/reports/accountStats').all(reportsPolicy.isAllowed)
    .get(reports.accountStats)


};
