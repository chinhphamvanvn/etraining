'use strict';

/**
 * Module dependencies
 */
var questionsPolicy = require('../policies/questions.server.policy'),
  questions = require('../controllers/questions.server.controller');

module.exports = function(app) {
  // Questions Routes
  app.route('/api/questions/bulk')
    .post(questionsPolicy.isAllowed, questions.bulkCreate);

  app.route('/api/questions/image/upload').post(questionsPolicy.isAllowed, questions.uploadQuestionImage);
  app.route('/api/questions/video/upload').post(questionsPolicy.isAllowed, questions.uploadQuestionVideo);
  app.route('/api/questions/audio/upload').post(questionsPolicy.isAllowed, questions.uploadQuestionAudio);
  app.route('/api/questions/file/upload').post(questionsPolicy.isAllowed, questions.uploadQuestionFile);

  app.route('/api/questions').all(questionsPolicy.isAllowed)
    .get(questions.list)
    .post(questions.create);

  app.route('/api/questions/byCategoryAndLevel/:groupId/:level').all(questionsPolicy.isAllowed)
    .get(questions.listByCategoryAndLevel);

  app.route('/api/questions/byCategory/:groupId').all(questionsPolicy.isAllowed)
    .get(questions.listByCategory);

  app.route('/api/questions/byIds/:questionIds').all(questionsPolicy.isAllowed)
    .get(questions.listByIds);

  app.route('/api/questions/:questionId').all(questionsPolicy.isAllowed)
    .get(questions.read)
    .put(questions.update)
    .delete(questions.delete);

  // Finish by binding the Question middleware
  app.param('questionId', questions.questionByID);
};
