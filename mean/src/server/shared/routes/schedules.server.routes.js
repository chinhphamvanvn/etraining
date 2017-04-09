'use strict';

/**
 * Module dependencies
 */
var schedulesPolicy = require('../policies/schedules.server.policy'),
  schedules = require('../controllers/schedules.server.controller');

module.exports = function(app) {
  // Schedules Routes
  app.route('/api/schedules').all(schedulesPolicy.isAllowed)
    .get(schedules.list)
    .post(schedules.create);

  app.route('/api/schedules/:scheduleId').all(schedulesPolicy.isAllowed)
    .get(schedules.read)
    .put(schedules.update)
    .delete(schedules.delete);

  // Finish by binding the Schedule middleware
  app.param('scheduleId', schedules.scheduleByID);
};
