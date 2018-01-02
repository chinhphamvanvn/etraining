'use strict';

/**
 * Module dependencies
 */
var candidatesPolicy = require('../policies/candidates.server.policy'),
  candidates = require('../controllers/candidates.server.controller');

module.exports = function(app) {
  // Candidates Routes
  app.route('/api/candidates').all(candidatesPolicy.isAllowed)
    .get(candidates.list)
    .post(candidates.create);

  app.route('/api/candidates/certify/:candidateId/:studentId').all(candidatesPolicy.isAllowed)
    .post(candidates.certify);

  app.route('/api/candidates/byUser/:userId').all(candidatesPolicy.isAllowed)
    .get(candidates.candidateByUser);

  app.route('/api/candidates/byExam/:examId').all(candidatesPolicy.isAllowed)
    .get(candidates.listByExam);

  app.route('/api/candidates/byUserAndSchedule/:userId/:scheduleId').all(candidatesPolicy.isAllowed)
    .get(candidates.candidateByUserAndSchedule);

  app.route('/api/candidates/:candidateId').all(candidatesPolicy.isAllowed)
    .get(candidates.read)
    .put(candidates.update)
    .delete(candidates.delete);

  // Finish by binding the Candidate middleware
  app.param('candidateId', candidates.candidateByID);
};
