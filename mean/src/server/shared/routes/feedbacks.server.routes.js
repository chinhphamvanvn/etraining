'use strict';

/**
 * Module dependencies
 */
var feedbacksPolicy = require('../policies/feedbacks.server.policy'),
  feedbacks = require('../controllers/feedbacks.server.controller');

module.exports = function(app) {
  // Exercisefeedbacks Routes
  app.route('/api/feedbacks').all(feedbacksPolicy.isAllowed)
    .get(feedbacks.list)
    .post(feedbacks.create);
  
  app.route('/api/feedbacks/byAttempt/:attemptId').all(feedbacksPolicy.isAllowed)
  .get(feedbacks.byAttempt)

  app.route('/api/feedbacks/:feedbackId').all(feedbacksPolicy.isAllowed)
    .get(feedbacks.read)
    .put(feedbacks.update)
    .delete(feedbacks.delete);

  // Finish by binding the Exercisefeedback middleware
  app.param('feedbackId', feedbacks.feedbackByID);
};
