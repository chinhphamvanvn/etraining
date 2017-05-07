'use strict';

/**
 * Module dependencies
 */
var practicesPolicy = require('../policies/practices.server.policy'),
  practices = require('../controllers/practices.server.controller');

module.exports = function(app) {
  // Exercises Routes
  app.route('/api/practices').all(practicesPolicy.isAllowed)
    .get(practices.list)
    .post(practices.create);

  app.route('/api/practices/:practiceId').all(practicesPolicy.isAllowed)
    .get(practices.read)
    .put(practices.update)
    .delete(practices.delete);

  // Finish by binding the Exercise middleware
  app.param('practiceId', practices.practiceByID);
};
