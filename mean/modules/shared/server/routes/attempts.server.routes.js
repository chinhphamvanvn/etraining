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
  
  app.route('/api/attempts/byMember/:memberId').all(attemptsPolicy.isAllowed)
  .get(attempts.listByMember);
  
  app.route('/api/attempts/byCourse/:courseId').all(attemptsPolicy.isAllowed)
  .get(attempts.listByCourse);
  
  app.route('/api/attempts/bySectionAndMember/:editionId/:sectionId/:memberId').all(attemptsPolicy.isAllowed)
  .get(attempts.listBySectionAndMember);
  
  app.route('/api/attempts/bySection/:editionId/:sectionId').all(attemptsPolicy.isAllowed)
  .get(attempts.listBySection);

  app.route('/api/attempts/:attemptId').all(attemptsPolicy.isAllowed)
    .get(attempts.read)
    .put(attempts.update)
    .delete(attempts.delete);

  // Finish by binding the Attempt middleware
  app.param('attemptId', attempts.attemptByID);
};
