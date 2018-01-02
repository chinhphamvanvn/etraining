'use strict';

/**
 * Module dependencies
 */
var submissionsPolicy = require('../policies/submissions.server.policy'),
  submissions = require('../controllers/submissions.server.controller');

module.exports = function(app) {
  // Submissions Routes
  app.route('/api/submissions').all(submissionsPolicy.isAllowed)
    .get(submissions.list)
    .post(submissions.create);

  app.route('/api/submissions/byExamAndCandidate/:examId/:candidateId').all(submissionsPolicy.isAllowed)
    .get(submissions.listByExamAndCandidate);
  app.route('/api/submissions/byExam/:examId').all(submissionsPolicy.isAllowed)
    .get(submissions.listByExam);
  app.route('/api/submissions/byCandidate/:candidateId').all(submissionsPolicy.isAllowed)
    .get(submissions.listByCandidate);

  app.route('/api/submissions/:submissionId').all(submissionsPolicy.isAllowed)
    .get(submissions.read)
    .put(submissions.update)
    .delete(submissions.delete);

  // Finish by binding the Submission middleware
  app.param('submissionId', submissions.submissionByID);
};
