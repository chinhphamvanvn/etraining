'use strict';

/**
 * Module dependencies
 */
var attemptsPolicy = require('../policies/attempts.server.policy'),
  attempts = require('../controllers/attempts.server.controller');

module.exports = function(app) {
  // Attempts Routes
  app.route('/api/attempts').all(attemptsPolicy.isAllowed)
    .get(attempts.list)
    .post(attempts.create);
  
  app.route('/api/attempts/byCourseAndMember/:editionId/:memberId').all(attemptsPolicy.isAllowed)
  .get(attempts.listByCourseAndMember);
  


  app.route('/api/attempts/:attemptId').all(attemptsPolicy.isAllowed)
    .get(attempts.read)
    .put(attempts.update)
    .delete(attempts.delete);

  // Finish by binding the Attempt middleware
  app.param('attemptId', attempts.attemptByID);
};
