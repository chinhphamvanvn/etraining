'use strict';

/**
 * Module dependencies
 */
var answersPolicy = require('../policies/answers.server.policy'),
  answers = require('../controllers/answers.server.controller');

module.exports = function(app) {
  // Answers Routes
  
  
  
  app.route('/api/answers').all(answersPolicy.isAllowed)
    .get(answers.list)
    .post(answers.create);

  app.route('/api/answers/byAttempt/:attemptId').all(answersPolicy.isAllowed)
    .get(answers.listByAttempt);

  app.route('/api/answers/:answerId').all(answersPolicy.isAllowed)
    .get(answers.read)
    .put(answers.update)
    .delete(answers.delete);

  // Finish by binding the Answer middleware
  app.param('answerId', answers.answerByID);
};
