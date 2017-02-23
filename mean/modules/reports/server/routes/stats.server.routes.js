'use strict';

/**
 * Module dependencies
 */
var statsPolicy = require('../policies/stats.server.policy'),
  stats = require('../controllers/stats.server.controller');

module.exports = function(app) {
  // Stats Routes
  app.route('/api/stats').all(statsPolicy.isAllowed)
    .get(stats.list)
    .post(stats.create);

  app.route('/api/stats/:statId').all(statsPolicy.isAllowed)
    .get(stats.read)
    .put(stats.update)
    .delete(stats.delete);

  // Finish by binding the Stat middleware
  app.param('statId', stats.statByID);
};
